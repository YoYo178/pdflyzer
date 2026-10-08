import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useCreateChat } from '@/api/mutations/chats/useCreateChat';
import { useDeleteChat } from '@/api/mutations/chats/useDeleteChat';
import { useUpdateChat } from '@/api/mutations/chats/useUpdateChat';
import { useDeleteDocument } from '@/api/mutations/documents/useDeleteDocument';
import { useUploadDocuments } from '@/api/mutations/documents/useUploadDocuments';
import { useGetAllChats } from '@/api/queries/chats/useGetAllChats';
import { useGetChat } from '@/api/queries/chats/useGetChat';
import { useGetDocuments } from '@/api/queries/documents/useGetDocuments';
import { useDocumentLiveUpdates } from '@/api/queries/documents/useDocumentLiveUpdates';
import { getErrorMessage } from '@/api/utils';
import Drawer from '@/components/ui/drawer';
import Logo from '@/components/ui/logo';
import { useAuth } from '@/hooks/useAuth';
import { formatChatCount, formatFileCount } from '@/lib/format';

import AppSidebar from './AppSidebar';
import ChatComposer from './ChatComposer';
import ChatNotFound from './ChatNotFound';
import ChatThread from './ChatThread';
import ChatTopbar from './ChatTopbar';
import ComposerUploadNotice from './ComposerUploadNotice';
import DashboardHome from './DashboardHome';
import useChatThread from '../../hooks/useChatThread';
import { useChatLiveUpdates } from '@/api/queries/chats/useChatLiveUpdates';

export type TWorkspaceMode = 'dashboard' | 'new' | 'chat';

interface ChatWorkspaceProps {
  mode: TWorkspaceMode;
  chatId?: string;
}

const TOAST = { position: 'bottom-center' } as const;

function ChatWorkspace({ mode, chatId }: ChatWorkspaceProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: chats = [] } = useGetAllChats();
  const documentsChatId = mode === 'chat' ? chatId : undefined;
  const { data: documents = [] } = useGetDocuments(documentsChatId);

  // Realtime indexing updates over the shared chat socket, with the documents
  // query keeping its HTTP polling fallback whenever the socket is unavailable.
  useDocumentLiveUpdates(documentsChatId);
  const {
    data: fetchedChat,
    isPending: isChatPending,
    isError: isChatMissing,
  } = useGetChat(mode === 'chat' ? chatId : undefined);

  const createChat = useCreateChat();
  const updateChat = useUpdateChat();
  const removeChat = useDeleteChat();
  const uploadDocuments = useUploadDocuments();
  const removeDocument = useDeleteDocument();

  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localChatId, setLocalChatId] = useState<string | null>(null);
  const pendingChat = useRef<Promise<string> | null>(null);

  const activeChatId = mode === 'chat' ? (chatId ?? null) : null;
  const hasActiveChat = mode !== 'dashboard';
  const threadKey = activeChatId ?? mode;

  useChatLiveUpdates(activeChatId ?? '');

  // A chat created in this session must never be re-seeded from the server, or
  // the empty message list would wipe the thread the user just started.
  const seedFromServer =
    activeChatId === null || activeChatId !== localChatId;

  const thread = useChatThread(activeChatId ?? '', seedFromServer);
  const {
    send,
    messages,
    isStreaming,
    statusLabel,
    stop,
    regenerate,
    rate,
    transport,
  } = thread;

  const activeChat = useMemo(
    () =>
      chats.find((chat) => chat._id === activeChatId) ?? fetchedChat ?? null,
    [chats, activeChatId, fetchedChat],
  );

  const readyCount = documents.filter(
    (document) => document.status === 'READY',
  ).length;
  const pageCount = documents
    .filter((document) => document.status === 'READY')
    .reduce((total, document) => total + document.pages, 0);

  // Mirrors ChatThread: with no messages and nothing indexed, the thread owns
  // the whole screen with its own upload call to action, so no bottom bar.
  const showComposerSlot = messages.length > 0 || readyCount > 0;

  const contextLabel =
    mode === 'dashboard'
      ? formatChatCount(chats.length)
      : pageCount > 0
        ? `${formatFileCount(readyCount)} · ${pageCount} pages in context`
        : formatFileCount(readyCount);

  const title =
    mode === 'dashboard'
      ? 'Dashboard'
      : mode === 'new'
        ? 'New chat'
        : (activeChat?.name ?? 'Chat');

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const openChat = useCallback(
    (id: string) => {
      closeSidebar();
      navigate(`/chats/${id}`);
    },
    [closeSidebar, navigate],
  );

  const newChat = useCallback(() => {
    closeSidebar();
    navigate('/chats/new');
  }, [closeSidebar, navigate]);

  const goToDashboard = useCallback(() => {
    closeSidebar();
    navigate('/dashboard');
  }, [closeSidebar, navigate]);

  /**
   * Resolves the chat id to write against, persisting a draft only once the
   * user actually does something with it. This keeps abandoned drafts out of
   * the sidebar while still letting `/chats/new` behave like a real chat.
   */
  const ensureChatId = useCallback(async () => {
    if (activeChatId) return activeChatId;
    if (pendingChat.current) return pendingChat.current;

    const request = createChat
      .mutateAsync()
      .then((chat) => {
        setLocalChatId(chat._id);
        navigate(`/chats/${chat._id}`, { replace: true });
        return chat._id;
      })
      .finally(() => {
        pendingChat.current = null;
      });

    pendingChat.current = request;
    return request;
  }, [activeChatId, createChat, navigate]);

  const ask = useCallback(
    async (prompt: string) => {
      try {
        // The chat must exist before a message can be streamed to it, so resolve
        // the id first rather than firing optimistically into `/chats/new`.
        const targetChatId = await ensureChatId();
        await send(prompt, targetChatId);
      } catch (error) {
        toast.error('Could not send message', {
          description: getErrorMessage(error),
          ...TOAST,
        });
      }
    },
    [ensureChatId, send],
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      try {
        const targetChatId = await ensureChatId();
        await uploadDocuments.mutateAsync({ chatId: targetChatId, files });

        toast.success(
          `${files.length} ${files.length === 1 ? 'PDF' : 'PDFs'} added`,
          {
            description: 'Indexing runs in the background.',
            ...TOAST,
          },
        );
      } catch (error) {
        toast.error('Upload failed', {
          description: getErrorMessage(error),
          ...TOAST,
        });
      }
    },
    [ensureChatId, uploadDocuments],
  );

  const renameChat = useCallback(
    (id: string, name: string) => {
      updateChat.mutate(
        { chatId: id, name },
        {
          onSuccess: () => toast.success('Chat renamed', TOAST),
          onError: (error) =>
            toast.error('Could not rename this chat', {
              description: getErrorMessage(error),
              ...TOAST,
            }),
        },
      );
    },
    [updateChat],
  );

  const pinChat = useCallback(
    (id: string, pinned: boolean) => {
      updateChat.mutate(
        { chatId: id, pinned },
        {
          onSuccess: () =>
            toast.success(pinned ? 'Chat pinned' : 'Chat unpinned', TOAST),
          onError: (error) =>
            toast.error(
              pinned ? 'Could not pin this chat' : 'Could not unpin this chat',
              {
                description: getErrorMessage(error),
                ...TOAST,
              },
            ),
        },
      );
    },
    [updateChat],
  );

  const deleteChat = useCallback(
    (id: string) => {
      removeChat.mutate(id, {
        onSuccess: () => {
          toast.success('Chat deleted', TOAST);
          if (id === activeChatId) goToDashboard();
        },
        onError: (error) =>
          toast.error('Could not delete this chat', {
            description: getErrorMessage(error),
            ...TOAST,
          }),
      });
    },
    [activeChatId, goToDashboard, removeChat],
  );

  const deleteDocument = useCallback(
    (documentId: string) => {
      if (!activeChatId) return;

      removeDocument.mutate(
        { chatId: activeChatId, documentId },
        {
          onSuccess: () => toast.success('PDF removed', TOAST),
          onError: (error) =>
            toast.error('Could not remove this PDF', {
              description: getErrorMessage(error),
              ...TOAST,
            }),
        },
      );
    },
    [activeChatId, removeDocument],
  );

  if (!user) return null;

  const sidebar = (
    <AppSidebar
      chats={chats}
      documents={documents}
      activeChatId={activeChatId}
      hasActiveChat={hasActiveChat}
      query={query}
      onQueryChange={setQuery}
      onSelectChat={openChat}
      onNewChat={newChat}
      onRenameChat={renameChat}
      onPinChat={pinChat}
      onDeleteChat={deleteChat}
      onAddDocuments={uploadFiles}
      onDeleteDocument={deleteDocument}
    />
  );

  return (
    <div className='flex h-dvh w-full overflow-hidden overscroll-none bg-background text-foreground antialiased selection:bg-teal-300/30 selection:text-teal-900 dark:selection:text-teal-100'>
      <aside className='hidden w-[268px] shrink-0 flex-col border-r border-border md:flex'>
        {sidebar}
      </aside>

      <Drawer
        id='chats-sidebar'
        open={sidebarOpen}
        onClose={closeSidebar}
        side='left'
        title={<Logo size='sm' />}
      >
        {sidebar}
      </Drawer>

      <main className='flex min-w-0 flex-1 flex-col'>
        <ChatTopbar
          title={title}
          contextLabel={contextLabel}
          isStreaming={isStreaming}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {mode === 'dashboard' ? (
          <div className='scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6'>
            <DashboardHome
              userName={user.name}
              chats={chats}
              onNewChat={newChat}
              onSelectChat={openChat}
            />
          </div>
        ) : isChatMissing ? (
          <div className='scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6'>
            <ChatNotFound onBack={goToDashboard} />
          </div>
        ) : mode === 'chat' && isChatPending ? (
          <div
            role='status'
            aria-label='Loading chat'
            className='flex min-h-0 flex-1 items-center justify-center'
          >
            <span className='h-5 w-5 animate-spin rounded-full border-2 border-border border-t-teal-600 dark:border-t-teal-300' />
          </div>
        ) : (
          <>
            <ChatThread
              threadKey={threadKey}
              messages={messages}
              documents={documents}
              isStreaming={isStreaming}
              statusLabel={statusLabel}
              transport={transport}
              onSuggestion={ask}
              onUpload={uploadFiles}
              isUploading={uploadDocuments.isPending}
              onRegenerate={regenerate}
              onRate={rate}
            />

{/* A chat can only be conversed once the backend has indexed a
                document, so the input is replaced by an upload prompt rather
                than removed — the slot keeps its place, and the user gets a
                way forward. */}
            {showComposerSlot && (
              <div className='relative shrink-0 px-3 pb-3 pt-1 sm:px-6 sm:pb-4'>
                <span
                  aria-hidden='true'
                  className='pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent'
                />
                <div className='relative mx-auto w-full max-w-3xl'>
                  {readyCount > 0 ? (
                    <ChatComposer
                      onSend={ask}
                      onStop={stop}
                      isStreaming={isStreaming}
                    />
                  ) : (
                    <ComposerUploadNotice
                      documents={documents}
                      isUploading={uploadDocuments.isPending}
                      onUpload={uploadFiles}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default ChatWorkspace;