import { useState } from 'react';
import { toast } from 'sonner';

import AppSidebar from './AppSidebar';
import ChatComposer from './ChatComposer';
import ChatThread from './ChatThread';
import ChatTopbar from './ChatTopbar';
import Drawer from '@/components/ui/drawer';
import Logo from '@/components/ui/logo';
import { MOCK_CHATS, MOCK_DOCUMENTS, MOCK_THREADS } from './mock-chat';
import useChatThread from './useChatThread';
import type { TChatMode } from '@/types/chat.types';

function titleFrom(prompt: string) {
  const words = prompt.replace(/\s+/g, ' ').trim().split(' ').slice(0, 6).join(' ');
  return words.length > 48 ? `${words.slice(0, 48).trimEnd()}…` : words;
}

const READY_DOCUMENTS = MOCK_DOCUMENTS.filter((document) => document.status === 'ready');
const INDEXING_COUNT = MOCK_DOCUMENTS.length - READY_DOCUMENTS.length;
const CONTEXT_LABEL = [
  `${READY_DOCUMENTS.length} documents`,
  `${READY_DOCUMENTS.reduce((total, document) => total + document.pages, 0)} pages in context`,
  INDEXING_COUNT > 0 ? `${INDEXING_COUNT} indexing` : null,
]
  .filter(Boolean)
  .join(' · ');

function ChatWorkspace() {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(MOCK_CHATS[0].id);
  const [mode, setMode] = useState<TChatMode>('ask');
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const thread = useChatThread(MOCK_THREADS[MOCK_CHATS[0].id] ?? []);
  const { load, send, messages, isStreaming, statusLabel, stop, regenerate, rate } = thread;

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;

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

  function ask(prompt: string, nextMode: TChatMode) {
    setMode(nextMode);

    if (activeChatId === null) {
      const id = `chat-${Date.now()}`;
      setChats((current) => [
        { id, title: titleFrom(prompt), updatedAt: new Date().toISOString() },
        ...current,
      ]);
      setActiveChatId(id);
    } else {
      setChats((current) =>
        current.map((chat) =>
          chat.id === activeChatId ? { ...chat, updatedAt: new Date().toISOString() } : chat,
        ),
      );
    }

    send(prompt, nextMode);
  }

  function deleteChat(id: string) {
    setChats((current) => current.filter((chat) => chat.id !== id));
    if (id === activeChatId) {
      setActiveChatId(null);
      load([]);
    }
    toast.success('Chat deleted', { position: 'bottom-center' });
  }

  function requestUpload() {
    toast.info('Uploading a PDF…', {
      description: 'Document ingestion is not connected yet.',
      position: 'bottom-center',
    });
  }

  const sidebar = (
    <AppSidebar
      chats={chats}
      documents={MOCK_DOCUMENTS}
      activeChatId={activeChatId}
      query={query}
      onQueryChange={setQuery}
      onSelectChat={openChat}
      onNewChat={newChat}
      onDeleteChat={deleteChat}
      onRequestUpload={requestUpload}
    />
  );

  return (
    <div className="flex h-dvh w-full overflow-hidden overscroll-none bg-background text-foreground antialiased selection:bg-teal-300/30 selection:text-teal-900 dark:selection:text-teal-100">
      <aside className="hidden w-[268px] shrink-0 flex-col border-r border-border bg-secondary/20 md:flex">
        <div className="flex min-h-0 flex-1 flex-col p-3">
          <Logo size="sm" className="mb-4 px-1" />
          {sidebar}
        </div>
      </aside>

      <Drawer
        id="chats-sidebar"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        side="left"
        title={<Logo size="sm" />}
      >
        {sidebar}
      </Drawer>

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatTopbar
          title={activeChat?.title ?? 'New chat'}
          contextLabel={CONTEXT_LABEL}
          isStreaming={isStreaming}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewChat={newChat}
        />

        <ChatThread
          threadKey={activeChatId}
          messages={messages}
          documents={MOCK_DOCUMENTS}
          isStreaming={isStreaming}
          statusLabel={statusLabel}
          onSuggestion={ask}
          onRegenerate={regenerate}
          onRate={rate}
        />

        <div className="relative shrink-0 px-3 pb-3 pt-1 sm:px-6 sm:pb-4">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent"
          />
          <div className="relative mx-auto w-full max-w-3xl">
            <ChatComposer
              mode={mode}
              onModeChange={setMode}
              onSend={(text) => ask(text, mode)}
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