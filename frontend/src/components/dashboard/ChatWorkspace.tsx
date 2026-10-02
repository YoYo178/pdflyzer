import { useState } from 'react';
import { toast } from 'sonner';

import Drawer from '@/components/ui/drawer';
import Logo from '@/components/ui/logo';
import { formatFileCount } from '@/lib/format';
import AppSidebar from './AppSidebar';
import ChatComposer from './ChatComposer';
import ChatThread from './ChatThread';
import ChatTopbar from './ChatTopbar';
import {
  MOCK_CHATS,
  MOCK_DOCUMENTS,
  MOCK_THREADS,
  MOCK_TRANSPORT,
} from './mock-chat';
import useChatThread from './useChatThread';

import { useGetAllChats } from '@/api/queries/chats/useGetAllChats';
import { useAuth } from '@/hooks/useAuth';
import type { IDocument } from '@/types/chat.types';

function titleFrom(prompt: string) {
  const words = prompt
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 6)
    .join(' ');
  return words.length > 48 ? `${words.slice(0, 48).trimEnd()}…` : words;
}

function ChatWorkspace() {
  const { data } = useGetAllChats();
  const { user } = useAuth();

  console.log({ data });

  const [chats, setChats] = useState(data ?? []);
  const [documents, setDocuments] = useState<IDocument[]>(MOCK_DOCUMENTS);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    MOCK_CHATS[0]._id,
  );
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const thread = useChatThread(
    MOCK_THREADS[MOCK_CHATS[0]._id] ?? [],
    MOCK_TRANSPORT,
  );
  const {
    load,
    send,
    messages,
    isStreaming,
    statusLabel,
    stop,
    regenerate,
    rate,
  } = thread;

  const activeChat = chats.find((chat) => chat._id === activeChatId) ?? null;
  const readyCount = documents.filter(
    (document) => document.status === 'ready',
  ).length;
  const pageCount = documents
    .filter((document) => document.status === 'ready')
    .reduce((total, document) => total + document.pages, 0);
  const contextLabel = `${formatFileCount(readyCount)} · ${pageCount} pages in context`;

  if (!chats || !user) return;

  function openChat(id: string) {
    setActiveChatId(id);
    load(MOCK_THREADS[id] ?? []);
    setSidebarOpen(false);
  }

  function newChat() {
    setActiveChatId(null);
    load([]);
    setSidebarOpen(false);
  }

  function ask(prompt: string) {
    if (activeChatId === null) {
      const id = `chat-${Date.now()}`;
      setChats((current) => [
        {
          _id: id,
          name: titleFrom(prompt),
          owner_id: user.id,
          updated_at: new Date().toISOString(),
        },
        ...current,
      ]);
      setActiveChatId(id);
    } else {
      setChats((current) =>
        current.map((chat) =>
          chat._id === activeChatId
            ? { ...chat, updated_at: new Date().toISOString() }
            : chat,
        ),
      );
    }

    send(prompt);
  }

  function renameChat(id: string, title: string) {
    setChats((current) =>
      current.map((chat) => (chat._id === id ? { ...chat, title } : chat)),
    );
    toast.success('Chat renamed', { position: 'bottom-center' });
  }

  function deleteChat(id: string) {
    setChats((current) => current.filter((chat) => chat._id !== id));
    if (id === activeChatId) {
      setActiveChatId(null);
      load([]);
    }
    toast.success('Chat deleted', { position: 'bottom-center' });
  }

  function addDocuments(files: File[]) {
    const added: IDocument[] = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      pages: 0,
      status: 'queued',
    }));

    setDocuments((current) => [...current, ...added]);
    toast.success(
      `${files.length} ${files.length === 1 ? 'PDF' : 'PDFs'} added`,
      {
        description: 'Ingestion is not connected to the backend yet.',
        position: 'bottom-center',
      },
    );
  }

  function deleteDocument(id: string) {
    setDocuments((current) => current.filter((document) => document.id !== id));
    toast.success('PDF removed', { position: 'bottom-center' });
  }

  function retryDocument(id: string) {
    setDocuments((current) =>
      current.map((document) =>
        document.id === id
          ? { ...document, status: 'queued' as const }
          : document,
      ),
    );
    toast.success('Re-queued for processing', { position: 'bottom-center' });
  }

  const sidebar = (
    <AppSidebar
      chats={chats}
      documents={documents}
      activeChatId={activeChatId}
      query={query}
      onQueryChange={setQuery}
      onSelectChat={openChat}
      onNewChat={newChat}
      onRenameChat={renameChat}
      onDeleteChat={deleteChat}
      onAddDocuments={addDocuments}
      onDeleteDocument={deleteDocument}
      onRetryDocument={retryDocument}
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
        onClose={() => setSidebarOpen(false)}
        side='left'
        title={<Logo size='sm' />}
      >
        {sidebar}
      </Drawer>

      <main className='flex min-w-0 flex-1 flex-col'>
        <ChatTopbar
          title={activeChat?.name ?? 'New chat'}
          contextLabel={contextLabel}
          isStreaming={isStreaming}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewChat={newChat}
        />

        <ChatThread
          threadKey={activeChatId}
          messages={messages}
          documents={documents}
          isStreaming={isStreaming}
          statusLabel={statusLabel}
          transport={MOCK_TRANSPORT}
          onSuggestion={ask}
          onRegenerate={regenerate}
          onRate={rate}
        />

        <div className='relative shrink-0 px-3 pb-3 pt-1 sm:px-6 sm:pb-4'>
          <span
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent'
          />
          <div className='relative mx-auto w-full max-w-3xl'>
            <ChatComposer
              onSend={ask}
              onStop={stop}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatWorkspace;
