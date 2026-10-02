import {
  IconFileUpload,
  IconLoader2,
  IconPaperclip,
} from '@tabler/icons-react';
import { useRef, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import type { IDocument } from '@/types/document.types';

interface ComposerUploadNoticeProps {
  documents: IDocument[];
  isUploading: boolean;
  onUpload: (files: File[]) => void;
}

/**
 * Stands in for the composer whenever a chat has nothing it can answer from.
 * It keeps the composer's exact chrome so the layout never shifts, and gives
 * the user both the reason and the fix instead of silently hiding the input.
 */
function ComposerUploadNotice({
  documents,
  isUploading,
  onUpload,
}: ComposerUploadNoticeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasReady = documents.some((document) => document.status === 'READY');
  const isIndexing = !hasReady && documents.length > 0;

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) onUpload(files);
    event.target.value = '';
  }

  const title = isIndexing
    ? 'Indexing your documents…'
    : 'Upload a PDF to start chatting';

  const description = isIndexing
    ? 'You can ask questions as soon as they finish processing.'
    : 'Answers are only ever grounded in the documents you add.';

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex items-center gap-2 px-1.5 py-1">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground"
        >
          {isIndexing ? (
            <IconLoader2 className="h-4.5 w-4.5 animate-spin text-teal-600 dark:text-teal-300" />
          ) : (
            <IconPaperclip className="h-4.5 w-4.5" />
          )}
        </span>

        <div className="min-w-0 flex-1 py-1">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {description}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="sr-only"
          onChange={onPick}
          tabIndex={-1}
        />

        <Button
          variant="brand"
          size="md"
          disabled={isIndexing || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="group shrink-0"
        >
          <IconFileUpload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          {isUploading ? 'Uploading…' : 'Upload PDF'}
        </Button>
      </div>
    </div>
  );
}

export default ComposerUploadNotice;