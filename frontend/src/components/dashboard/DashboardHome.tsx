import {
  IconArrowRight,
  IconFiles,
  IconMessageCircle,
  IconMessagePlus,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useMemo, useRef, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import Reveal from '@/components/ui/reveal';
import { formatChatCount, formatRelativeTime } from '@/lib/format';
import type { IChat } from '@/types/chat.types';

const EASE = [0.22, 1, 0.36, 1] as const;
const RECENT_LIMIT = 6;

function greetingFor(date: Date) {
  const hour = date.getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

interface DashboardHomeProps {
  userName: string;
  chats: IChat[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

function DashboardHome({
  userName,
  chats,
  onNewChat,
  onSelectChat,
}: DashboardHomeProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  const recentChats = useMemo(
    () =>
      [...chats]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, RECENT_LIMIT),
    [chats],
  );

  const firstName = userName.trim().split(/\s+/)[0] || userName;

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const element = glowRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    element.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }

  return (
    <div
      className='relative flex min-h-full flex-col justify-center overflow-hidden px-1 py-10'
      onMouseMove={onMove}
    >
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_50%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]' />
        <div className='absolute -top-32 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-teal-500/15 blur-[130px] dark:bg-teal-400/10' />
        <div
          ref={glowRef}
          className='absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(340px_circle_at_var(--mx,50%)_var(--my,0%),rgba(20,184,166,0.10),transparent_65%)]'
        />
      </div>

      <div className='mx-auto w-full max-w-4xl'>
        <div className='text-center'>
          <Reveal delay={80}>
            <h1 className='mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl'>
              {greetingFor(new Date())}
              {firstName ? `, ${firstName}` : ''}
              <span className='mt-1.5 block bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent dark:from-teal-300 dark:via-cyan-300 dark:to-teal-300'>
                Ready when you are.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className='mx-auto mt-5 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base'>
              Start a chat, drop in the PDFs you want to reason about, and every
              answer comes back with the exact page it came from.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <Button
              variant='brand'
              size='lg'
              onClick={onNewChat}
              className='group mt-8 w-full sm:w-auto'
            >
              <IconMessagePlus className='h-4 w-4' strokeWidth={1.75} />
              Start a new chat
              <IconArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </Button>
          </Reveal>
        </div>

        <section className='mt-14' aria-labelledby='dashboard-recent-heading'>
          <div className='flex items-center gap-3'>
            <h2
              id='dashboard-recent-heading'
              className='shrink-0 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/70'
            >
              Recent
            </h2>
            <span className='h-px flex-1 bg-border' />
            <span className='shrink-0 text-[11px] tabular-nums text-muted-foreground'>
              {formatChatCount(chats.length)}
            </span>
          </div>

          {recentChats.length === 0 ? (
            <div className='mt-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center'>
              <span className='flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground'>
                <IconMessageCircle className='h-5 w-5' strokeWidth={1.75} />
              </span>
              <p className='text-sm font-semibold text-foreground'>
                No chats yet
              </p>
              <p className='max-w-xs text-xs leading-relaxed text-muted-foreground'>
                Your conversations will show up here once you create one.
              </p>
            </div>
          ) : (
            <ul className='mt-5 grid gap-3 sm:grid-cols-2'>
              {recentChats.map((chat, index) => (
                <motion.li
                  key={chat._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: EASE,
                  }}
                  className='h-full'
                >
                  <button
                    type='button'
                    onClick={() => onSelectChat(chat._id)}
                    className='group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-secondary/40 p-4 text-left transition-colors duration-300 hover:border-teal-600/40 dark:hover:border-teal-300/30'
                  >
                    <div className='pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-teal-500/0 blur-3xl transition-colors duration-500 group-hover:bg-teal-500/10 dark:group-hover:bg-teal-300/10' />

                    <div className='relative flex min-w-0 items-start gap-3'>
                      <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-teal-600 dark:text-teal-300'>
                        <IconFiles className='h-4.5 w-4.5' strokeWidth={1.75} />
                      </span>
                      <span className='min-w-0 flex-1'>
                        <span className='block truncate text-sm font-semibold text-foreground'>
                          {chat.name}
                        </span>
                        <span className='mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground'>
                          <span className='tabular-nums'>
                            {formatRelativeTime(chat.updated_at)}
                          </span>
                          <IconArrowRight className='h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100' />
                        </span>
                      </span>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardHome;
