import { formatBytes } from '@/lib/format';
import type { IDocument } from '@/types/document.types';
import { IconFileText, IconUpload } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useRef, type ChangeEvent } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_LABEL: Record<IDocument['status'], string> = {
  QUEUED: 'Waiting to be processed',
  PROCESSING: 'Reading text and indexing',
  READY: 'Ready',
  FAILED: 'Could not be read',
};

interface ChatNeedsDocumentsProps {
  documents: IDocument[];
  isUploading: boolean;
  onUpload: (files: File[]) => void;
}

function ChatNeedsDocuments({
  documents,
  isUploading,
  onUpload,
}: ChatNeedsDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasDocuments = documents.length > 0;

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) onUpload(files);
    event.target.value = '';
  }

  return (
    <div className='mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-1 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className='text-center'
      >
        <span className='inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-teal-600 shadow-[0_18px_40px_-18px_rgba(20,184,166,0.55)] dark:text-teal-300'>
          {hasDocuments ? (
            <IconFileText className='h-5 w-5' strokeWidth={1.75} />
          ) : (
            <IconUpload className='h-5 w-5' strokeWidth={1.75} />
          )}
        </span>

        <h1 className='mt-5 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {hasDocuments ? 'Reading your documents' : 'Add a document to begin'}
        </h1>
        <p className='mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base'>
          {hasDocuments
            ? 'We are extracting and indexing the text now. Once it is ready you can ask a question and every answer will cite the exact page it used.'
            : 'pdflyzer can only answer from the documents you add to a chat. Upload a PDF and it will be parsed and indexed automatically.'}
        </p>
      </motion.div>

      {hasDocuments ? (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
          className='mx-auto mt-8 w-full max-w-lg space-y-1.5'
        >
          {documents.map((document) => (
            <li
              key={document._id}
              className='rounded-xl border border-border bg-secondary/40 px-3.5 py-3'
            >
              <div className='flex items-center gap-2.5'>
                <IconFileText
                  className='h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300'
                  strokeWidth={1.75}
                />
                <span className='min-w-0 flex-1 truncate text-sm font-medium text-foreground'>
                  {document.filename}
                </span>
                <span className='shrink-0 text-[11px] tabular-nums text-muted-foreground'>
                  {formatBytes(document.size)}
                </span>
              </div>

              <p
                className={
                  document.status === 'FAILED'
                    ? 'mt-1 pl-6.5 text-[11px] text-destructive'
                    : 'mt-1 pl-6.5 text-[11px] text-muted-foreground'
                }
              >
                {STATUS_LABEL[document.status]}
              </p>

              {document.status === 'PROCESSING' && (
                <span className='relative mt-2 ml-6.5 block h-1 overflow-hidden rounded-full bg-border'>
                  <span className='progress-indeterminate absolute inset-y-0 left-0 w-1/3 rounded-full bg-teal-600 dark:bg-teal-300' />
                </span>
              )}
            </li>
          ))}
        </motion.ul>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
          className='mt-8 flex flex-col items-center gap-3'
        >
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className='group flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-10 transition-colors duration-300 hover:border-teal-600/50 hover:bg-teal-500/5 focus-visible:border-teal-600/50 focus-visible:bg-teal-500/5 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:hover:border-teal-300/50 dark:hover:bg-teal-300/5 dark:focus-visible:border-teal-300/50 dark:focus-visible:bg-teal-300/5'
          >
            <span className='flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-teal-600 transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-teal-300'>
              <IconUpload className='h-5 w-5' strokeWidth={1.75} />
            </span>
            <span className='text-sm font-semibold text-foreground'>
              {isUploading ? 'Uploading…' : 'Choose a PDF'}
            </span>
            <span className='text-xs text-muted-foreground'>
              or add one from the sidebar
            </span>
          </button>

          <input
            ref={fileInputRef}
            type='file'
            accept='application/pdf,.pdf'
            multiple
            className='sr-only'
            onChange={onPick}
            tabIndex={-1}
          />

          <p className='text-[11px] text-muted-foreground/80'>
            PDF only · up to 5 files per chat
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default ChatNeedsDocuments;
