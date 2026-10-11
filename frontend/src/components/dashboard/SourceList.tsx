import { formatPageText, formatParagraphText } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { IDocument } from '@/types/document.types';
import type { IMessageSource } from '@/types/message.types';
import {
  IconCheck,
  IconCopy,
  IconFileText,
  IconListCheck,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface SourceListProps {
  sources: IMessageSource[];
  messageId: string;
  activeIndex: number | null;
  documents: IDocument[];
}

function SourceList({
  sources,
  messageId,
  activeIndex,
  documents,
}: SourceListProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function getSourceFilename(source: IMessageSource): string {
    return (
      documents.find(
        (doc) => doc.stored_document._id === source.stored_document,
      )?.stored_document.filename ?? ''
    );
  }

  function copy(source: IMessageSource, index: number) {
    const reference = `${getSourceFilename(source)} — ${formatPageText(source)} · ${formatParagraphText(source)} · ${source.section.replaceAll('\n', ' ').trim()}`;
    void navigator.clipboard?.writeText(reference);
    setCopied(index);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1600);
    toast.success('Source reference copied', { position: 'bottom-center' });
  }

  return (
    <div className='space-y-2 border-t border-border pt-3'>
      <p className='flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
        <IconListCheck className='h-3 w-3' />
        Sources
      </p>

      <ul className='space-y-1.5'>
        {sources.map((source, index) => {
          const position = index + 1;
          const isActive = activeIndex === position;
          const isCopied = copied === position;

          return (
            <li
              key={`${getSourceFilename(source)}.${source.page_start}-${source.page_end}.${source.paragraph_start}-${source.paragraph_end}`}
            >
              <button
                id={`source-${messageId}-${position}`}
                type='button'
                onClick={() => copy(source, position)}
                aria-label={`Copy reference to ${getSourceFilename(source)}, page ${source.page_start}`}
                className={cn(
                  'group flex w-full scroll-mt-4 items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors duration-200',
                  'border-border bg-secondary/40 hover:border-teal-600/40 hover:bg-secondary/70 dark:hover:border-teal-300/30',
                  isActive &&
                    'border-teal-600/60 bg-teal-500/10 ring-2 ring-teal-500/20 dark:border-teal-300/50 dark:bg-teal-300/10 dark:ring-teal-300/25',
                )}
              >
                <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-teal-500/15 text-[9px] font-bold text-teal-700 dark:bg-teal-300/15 dark:text-teal-300'>
                  {position}
                </span>

                <IconFileText className='h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-300' />

                <div className='min-w-0 flex-1'>
                  <p className='truncate text-[11px] font-medium text-foreground'>
                    {getSourceFilename(source)}
                  </p>
                  <p className='truncate text-[10px] text-muted-foreground'>
                    {formatPageText(source)} · {formatParagraphText(source)} ·{' '}
                    {source.section}
                  </p>
                </div>

                {isCopied ? (
                  <IconCheck className='h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-300' />
                ) : (
                  <IconCopy className='h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100' />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SourceList;
