import type { TStreamTransport } from '@/lib/stream/types';
import { cn } from '@/lib/utils';
import type { IMessage } from '@/types/message.types';
import {
  IconBroadcast,
  IconCheck,
  IconCopy,
  IconRefresh,
  IconSparkles,
  IconThumbDown,
  IconThumbUp,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import MessageContent from './MessageContent';
import SourceList from './SourceList';

const EASE = [0.22, 1, 0.36, 1] as const;

function ActionButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
        active
          ? 'bg-teal-500/15 text-teal-700 dark:bg-teal-300/15 dark:text-teal-300'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function ThinkingDots() {
  return (
    <div
      className='flex items-center gap-1.5 py-2'
      role='status'
      aria-label='Thinking'
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className='h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-300'
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.16,
          }}
        />
      ))}
    </div>
  );
}

const TRANSPORT_LABEL: Record<TStreamTransport, string> = {
  websocket: 'WebSocket',
  sse: 'SSE',
};

function StreamingStatus({
  label,
  transport,
}: {
  label: string;
  transport: TStreamTransport;
}) {
  return (
    <div className='space-y-2'>
      {label && (
        <p className='text-[13px] font-medium leading-relaxed'>
          <motion.span
            className='bg-gradient-to-r from-teal-700 via-zinc-500 to-teal-700 bg-clip-text text-transparent dark:from-teal-300 dark:via-zinc-400 dark:to-teal-300'
            style={{ backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
          >
            {label}
          </motion.span>
          <motion.span
            aria-hidden='true'
            className='ml-1 inline-block h-[1em] w-[5px] rounded-[1px] bg-teal-500 align-text-top dark:bg-teal-300'
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
        </p>
      )}

      <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground'>
        <IconBroadcast className='h-3 w-3 animate-pulse' />
        Receiving tokens over {TRANSPORT_LABEL[transport]}
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: IMessage;
  isLast: boolean;
  isStreaming: boolean;
  statusLabel: string;
  transport: TStreamTransport;
  activeCitation: number | null;
  onCitationClick: (index: number) => void;
  onRegenerate: () => void;
  onRate: (id: string, rating: 'up' | 'down' | null) => void;
}

function ChatMessage({
  message,
  isLast,
  isStreaming,
  statusLabel,
  transport,
  activeCitation,
  onCitationClick,
  onRegenerate,
  onRate,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (message.sender_role === 'user') {
    return (
      <div className='flex justify-end'>
        <div className='max-w-[85%] rounded-2xl rounded-br-md border border-teal-600/25 bg-teal-500/10 px-4 py-2.5 text-pretty text-sm leading-relaxed text-foreground sm:max-w-[75%] dark:border-teal-300/20 dark:bg-teal-300/[0.08]'>
          {message.content}
        </div>
      </div>
    );
  }

  function copy() {
    void navigator.clipboard?.writeText(message.content);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
    toast.success('Answer copied', { position: 'bottom-center' });
  }

  function rate(value: 'up' | 'down') {
    const next = message.rating === value ? null : value;
    onRate(message._id, next);
    if (next)
      toast.success('Thanks for the feedback', { position: 'bottom-center' });
  }

  return (
    <div className='flex gap-3'>
      <div className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700 ring-1 ring-teal-600/30 dark:bg-teal-300/15 dark:text-teal-300 dark:ring-teal-300/30'>
        <IconSparkles className='h-3.5 w-3.5' />
      </div>

      <div className='min-w-0 flex-1 space-y-3'>
        {message.content ? (
          <MessageContent
            content={message.content}
            onCitationClick={onCitationClick}
            className='text-sm text-muted-foreground'
          />
        ) : (
          <ThinkingDots />
        )}

        {isStreaming && (
          <StreamingStatus label={statusLabel} transport={transport} />
        )}

        {!isStreaming && (
          <>
            {message.sources && message.sources.length > 0 && (
              <SourceList
                sources={message.sources}
                messageId={message._id}
                activeIndex={activeCitation}
              />
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className='flex items-center gap-1'
            >
              <ActionButton label='Copy answer' onClick={copy}>
                {copied ? (
                  <IconCheck className='h-3.5 w-3.5 text-teal-600 dark:text-teal-300' />
                ) : (
                  <IconCopy className='h-3.5 w-3.5' />
                )}
              </ActionButton>

              {isLast && (
                <ActionButton label='Regenerate answer' onClick={onRegenerate}>
                  <IconRefresh className='h-3.5 w-3.5' />
                </ActionButton>
              )}

              <span className='flex-1' />

              <ActionButton
                label='Helpful'
                active={message.rating === 'up'}
                onClick={() => rate('up')}
              >
                <IconThumbUp className='h-3.5 w-3.5' />
              </ActionButton>
              <ActionButton
                label='Not helpful'
                active={message.rating === 'down'}
                onClick={() => rate('down')}
              >
                <IconThumbDown className='h-3.5 w-3.5' />
              </ActionButton>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
