import { IconArrowLeft, IconFileUnknown } from '@tabler/icons-react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface ChatNotFoundProps {
  onBack: () => void;
}

function ChatNotFound({ onBack }: ChatNotFoundProps) {
  return (
    <div className='mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-1 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className='text-center'
      >
        <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground'>
          <IconFileUnknown className='h-5 w-5' strokeWidth={1.75} />
        </span>

        <h1 className='mt-5 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          Chat not found
        </h1>
        <p className='mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base'>
          This chat no longer exists, or it belongs to a different account.
        </p>

        <button
          type='button'
          onClick={onBack}
          className='mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-teal-600/40 hover:bg-secondary focus-visible:border-teal-600/40 focus-visible:bg-secondary focus-visible:outline-none dark:hover:border-teal-300/30'
        >
          <IconArrowLeft className='h-4 w-4' strokeWidth={1.75} />
          Back to dashboard
        </button>
      </motion.div>
    </div>
  );
}

export default ChatNotFound;