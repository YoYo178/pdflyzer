import { cn } from '@/lib/utils';
import type { IDocument } from '@/types/document.types';
import { IconFileText, IconSparkles } from '@tabler/icons-react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface ChatEmptyStateProps {
  documents: IDocument[];
}

function ChatEmptyState({ documents }: ChatEmptyStateProps) {
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
            key={document.id}
            className={cn(
              'inline-flex max-w-[14rem] items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground',
              document.stored_document.status !== 'READY' && 'opacity-60',
            )}
          >
            <IconFileText className='h-3 w-3 shrink-0 text-teal-600 dark:text-teal-300' />
            <span className='truncate'>
              {document.stored_document.filename}
            </span>
            {document.stored_document.status !== 'READY' && (
              <span className='shrink-0 text-[10px] uppercase tracking-wide'>
                {document.stored_document.status}
              </span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default ChatEmptyState;
