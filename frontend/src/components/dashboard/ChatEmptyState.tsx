import { cn } from '@/lib/utils';
import type { IDocument } from '@/types/document.types';
import {
  IconCalendarStats,
  IconCoin,
  IconFileDescription,
  IconFileText,
  IconScale,
  IconSparkles,
} from '@tabler/icons-react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

const SUGGESTIONS: {
  icon: typeof IconCoin;
  label: string;
  prompt: string;
}[] = [
  {
    icon: IconCoin,
    label: 'Payment terms & renewal',
    prompt:
      'What are the payment terms in both contracts, and do they change on renewal?',
  },
  {
    icon: IconScale,
    label: 'Termination clauses',
    prompt: 'Compare the termination clauses across all three documents.',
  },
  {
    icon: IconFileDescription,
    label: 'Summarise the SOW',
    prompt:
      'Summarise the Statement of Work into a short brief for the leadership review.',
  },
  {
    icon: IconCalendarStats,
    label: 'Key dates & deadlines',
    prompt:
      'List every deadline, renewal window and notice period across these documents.',
  },
];

interface ChatEmptyStateProps {
  documents: IDocument[];
  onPick: (prompt: string) => void;
}

function ChatEmptyState({ documents, onPick }: ChatEmptyStateProps) {
  return (
    <div className='mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-1 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className='text-center'
      >
        <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-teal-600 shadow-[0_18px_40px_-18px_rgba(20,184,166,0.55)] dark:text-teal-300'>
          <IconSparkles className='h-5 w-5' strokeWidth={1.75} />
        </span>

        <h1 className='mt-5 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          Ask anything about your documents
        </h1>
        <p className='mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base'>
          pdflyzer reads across every file in this chat and cites the exact page
          it used — so you can verify any claim in one click.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        className='mt-7 flex flex-wrap items-center justify-center gap-1.5'
      >
        {documents.map((document) => (
          <span
            key={document._id}
            className={cn(
              'inline-flex max-w-[14rem] items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground',
              document.status !== 'READY' && 'opacity-60',
            )}
          >
            <IconFileText className='h-3 w-3 shrink-0 text-teal-600 dark:text-teal-300' />
            <span className='truncate'>{document.filename}</span>
            {document.status !== 'READY' && (
              <span className='shrink-0 text-[10px] uppercase tracking-wide'>
                {document.status}
              </span>
            )}
          </span>
        ))}
      </motion.div>

      <div className='mt-8 grid gap-3 sm:grid-cols-2'>
        {SUGGESTIONS.map((suggestion, index) => (
          <motion.button
            key={suggestion.label}
            type='button'
            onClick={() => onPick(suggestion.prompt)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.22 + index * 0.06,
              ease: EASE,
            }}
            className='group relative overflow-hidden rounded-2xl border border-border bg-secondary/40 p-4 text-left transition-colors duration-300 hover:border-teal-600/40 dark:hover:border-teal-300/30'
          >
            <div className='pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-500/0 blur-3xl transition-colors duration-500 group-hover:bg-teal-500/10 dark:group-hover:bg-teal-300/10' />

            <div className='relative flex items-start gap-3'>
              <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-teal-600 dark:text-teal-300'>
                <suggestion.icon className='h-4.5 w-4.5' strokeWidth={1.75} />
              </span>
              <span className='min-w-0'>
                <span className='block text-sm font-semibold text-foreground'>
                  {suggestion.label}
                </span>
                <span className='mt-1 block text-xs leading-relaxed text-muted-foreground'>
                  {suggestion.prompt}
                </span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default ChatEmptyState;
