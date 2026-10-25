import { IconArrowUp, IconPaperclip, IconPlayerStop, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';

const MAX_LENGTH = 4000;

interface ChatComposerProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

function ChatComposer({ onSend, onStop, isStreaming }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 220)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setValue('');
    setFiles([]);
    textareaRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (event.nativeEvent.isComposing) return;
    event.preventDefault();
    submit();
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []).map((file) => file.name);
    if (picked.length > 0) setFiles((current) => [...current, ...picked]);
    event.target.value = '';
  }

  const canSend = value.trim().length > 0;
  const showCounter = value.length > MAX_LENGTH - 800;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="rounded-2xl border border-border bg-card/70 p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors duration-200 focus-within:border-teal-600/50 dark:focus-within:border-teal-300/40"
    >
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 px-1.5 pb-2 pt-1">
          {files.map((name) => (
            <li
              key={name}
              className="inline-flex max-w-[12rem] items-center gap-1.5 rounded-lg border border-border bg-secondary/60 py-1 pl-2 pr-1 text-[11px] text-foreground"
            >
              <span className="truncate">{name}</span>
              <button
                type="button"
                onClick={() => setFiles((current) => current.filter((file) => file !== name))}
                aria-label={`Remove ${name}`}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
              >
                <IconX className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-end gap-2 px-1.5 py-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach a PDF"
          title="Attach a PDF"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <IconPaperclip className="h-4.5 w-4.5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="sr-only"
          onChange={onPick}
          tabIndex={-1}
        />

        <label htmlFor="chat-composer" className="sr-only">
          Message PDFlyzer
        </label>
        <textarea
          id="chat-composer"
          ref={textareaRef}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask a question about your documents…"
          className="scrollbar-slim max-h-[220px] min-h-[2.25rem] flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
        />

        <button
          type={isStreaming ? 'button' : 'submit'}
          onClick={isStreaming ? onStop : undefined}
          aria-label={isStreaming ? 'Stop generating' : 'Send message'}
          title={isStreaming ? 'Stop generating' : 'Send message'}
          disabled={!isStreaming && !canSend}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
            isStreaming || canSend
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/25 hover:bg-teal-500 dark:bg-teal-300 dark:text-zinc-950 dark:shadow-teal-300/20 dark:hover:bg-teal-200'
              : 'cursor-not-allowed bg-secondary text-muted-foreground/50',
          )}
        >
          {isStreaming ? (
            <IconPlayerStop className="h-4 w-4" />
          ) : (
            <IconArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-end gap-3 px-1.5 pb-1 pt-2">
        {showCounter && (
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {value.length}/{MAX_LENGTH}
          </span>
        )}

        <span className="hidden text-[11px] text-muted-foreground/80 md:block">
          <kbd className="rounded border border-border bg-secondary/60 px-1 py-0.5 font-sans text-[10px]">
            Enter
          </kbd>{' '}
          to send ·{' '}
          <kbd className="rounded border border-border bg-secondary/60 px-1 py-0.5 font-sans text-[10px]">
            Shift + Enter
          </kbd>{' '}
          for a new line
        </span>
      </div>
    </form>
  );
}

export default ChatComposer;