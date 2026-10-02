import { IconArrowDown } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import ChatEmptyState from './ChatEmptyState';
import ChatMessage from './ChatMessage';
import type { IDocument, IChatMessage, TStreamTransport } from '@/types/chat.types';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000);

  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return 'Earlier this week';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface ChatThreadProps {
  threadKey: string | null;
  messages: IChatMessage[];
  documents: IDocument[];
  isStreaming: boolean;
  statusLabel: string;
  transport: TStreamTransport;
  onSuggestion: (prompt: string) => void;
  onRegenerate: () => void;
  onRate: (id: string, rating: 'up' | 'down' | null) => void;
}

function ChatThread({
  threadKey,
  messages,
  documents,
  isStreaming,
  statusLabel,
  transport,
  onSuggestion,
  onRegenerate,
  onRate,
}: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);
  const [jumpState, setJumpState] = useState({ key: threadKey, visible: false });
  const showJump = jumpState.key === threadKey && jumpState.visible;
  const [activeCitation, setActiveCitation] = useState<{
    messageId: string;
    index: number;
  } | null>(null);
  const citationTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(citationTimer.current), []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !pinnedRef.current) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, isStreaming]);

  useEffect(() => {
    pinnedRef.current = true;
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [threadKey]);

  function onScroll() {
    const element = scrollRef.current;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    pinnedRef.current = distance < 120;
    setJumpState({ key: threadKey, visible: distance > 240 });
  }

  function jumpToBottom() {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    pinnedRef.current = true;
    setJumpState({ key: threadKey, visible: false });
  }

  function onCitationClick(messageId: string, index: number) {
    setActiveCitation({ messageId, index });
    window.clearTimeout(citationTimer.current);
    citationTimer.current = window.setTimeout(() => setActiveCitation(null), 2000);
    document
      .getElementById(`source-${messageId}-${index}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const rows = useMemo(() => {
    const result: { message: IChatMessage; day: string; showDivider: boolean }[] = [];
    let previousDay = '';

    for (const message of messages) {
      const day = dayLabel(message.created_at);
      result.push({ message, day, showDivider: day !== previousDay });
      previousDay = day;
    }

    return result;
  }, [messages]);

  const lastAssistantId = [...messages]
    .reverse()
    .find((message) => message.sender_role === 'system')?._id; // TODO: change to assistant

    console.log({ messages })

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        role="log"
        aria-live={isStreaming ? 'off' : 'polite'}
        aria-relevant="additions text"
        aria-label="Conversation"
        aria-busy={isStreaming}
        tabIndex={0}
        className="scrollbar-slim h-full overflow-y-auto overscroll-contain px-4 py-6 sm:px-6"
      >
        {messages.length === 0 ? (
          <ChatEmptyState documents={documents} onPick={onSuggestion} />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-6">
            {rows.map(({ message, day, showDivider }) => (
              <div key={message._id} className="space-y-6">
                  {showDivider && (
                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-border" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {day}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <ChatMessage
                      message={message}
                      isLast={message._id === lastAssistantId}
                      isStreaming={isStreaming && message._id === lastAssistantId}
                      statusLabel={statusLabel}
                      transport={transport}
                      activeCitation={
                        activeCitation?.messageId === message._id ? activeCitation.index : null
                      }
                      onCitationClick={(index) => onCitationClick(message._id, index)}
                      onRegenerate={onRegenerate}
                      onRate={onRate}
                    />
                  </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showJump && (
          <motion.button
            type="button"
            onClick={jumpToBottom}
            aria-label="Scroll to latest message"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={cn(
              'absolute bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full',
              'border border-border bg-card text-muted-foreground shadow-lg transition-colors hover:text-foreground',
            )}
          >
            <IconArrowDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatThread;