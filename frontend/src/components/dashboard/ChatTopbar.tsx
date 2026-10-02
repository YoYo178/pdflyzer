import { IconMenu2 } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';

import UserMenu from './UserMenu';

interface ChatTopbarProps {
  title: string;
  contextLabel: string;
  isStreaming: boolean;
  onOpenSidebar: () => void;
}

function ChatTopbar({
  title,
  contextLabel,
  isStreaming,
  onOpenSidebar,
}: ChatTopbarProps) {
  return (
    <header className='flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-xl sm:px-4'>
      <button
        type='button'
        onClick={onOpenSidebar}
        aria-label='Open chats sidebar'
        title='Open chats sidebar'
        className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden'
      >
        <IconMenu2 className='h-4.5 w-4.5' />
      </button>

      <div className='min-w-0 flex-1'>
        {title.toLowerCase() !== 'dashboard' && (
          <>
            <h1 className='truncate text-sm font-semibold text-foreground'>
              {title}
            </h1>
            <p className='truncate text-[11px] text-muted-foreground'>
              {contextLabel}
            </p>
          </>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isStreaming && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className='hidden items-center gap-1.5 rounded-full border border-teal-600/25 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-700 sm:inline-flex dark:border-teal-300/25 dark:bg-teal-300/10 dark:text-teal-200'
          >
            <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 dark:bg-teal-300' />
            Streaming
          </motion.span>
        )}
      </AnimatePresence>

      <UserMenu />
    </header>
  );
}

export default ChatTopbar;
