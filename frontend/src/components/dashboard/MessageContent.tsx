import { Fragment, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const INLINE_TOKENS = /(\[\[\d+\]\]|\*\*[^*]+\*\*)/g;

const CITATION = /^\[\[(\d+)\]\]$/;

function renderInline(text: string, onCitationClick: (index: number) => void) {
  return text
    .split(INLINE_TOKENS)
    .filter(Boolean)
    .map((part, index) => {
      const citation = part.match(CITATION);

      if (citation) {
        const source = Number(citation[1]);
        return (
          <button
            key={index}
            type="button"
            onClick={() => onCitationClick(source)}
            aria-label={`Jump to source ${source}`}
            className="mx-0.5 rounded px-0.5 align-super text-[10px] font-semibold text-teal-600 transition-colors hover:bg-teal-500/15 dark:text-teal-300"
          >
            [{source}]
          </button>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span
            key={index}
            className="rounded bg-teal-500/15 px-1 font-medium text-foreground dark:bg-teal-300/15"
          >
            {part.slice(2, -2)}
          </span>
        );
      }

      return <Fragment key={index}>{part}</Fragment>;
    });
}

interface MessageContentProps {
  content: string;
  onCitationClick: (index: number) => void;
  className?: string;
}

function MessageContent({ content, onCitationClick, className }: MessageContentProps) {
  const nodes: ReactNode[] = [];
  const paragraph: string[] = [];
  const bullets: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    const text = paragraph.join(' ');
    paragraph.length = 0;
    nodes.push(
      <p key={nodes.length} className="leading-relaxed">
        {renderInline(text, onCitationClick)}
      </p>,
    );
  }

  function flushBullets() {
    if (bullets.length === 0) return;
    const items = [...bullets];
    bullets.length = 0;
    nodes.push(
      <ul key={nodes.length} className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-500 dark:bg-teal-300"
            />
            <span className="min-w-0">{renderInline(item, onCitationClick)}</span>
          </li>
        ))}
      </ul>,
    );
  }

  function flush() {
    flushParagraph();
    flushBullets();
  }

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      flush();
      continue;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      bullets.push(trimmed.slice(2));
      continue;
    }

    flushBullets();

    if (trimmed.startsWith('## ')) {
      nodes.push(
        <h4 key={nodes.length} className="text-[15px] font-semibold tracking-tight text-foreground">
          {renderInline(trimmed.slice(3), onCitationClick)}
        </h4>,
      );
      continue;
    }

    paragraph.push(trimmed);
  }

  flush();

  return <div className={cn('space-y-4 text-pretty', className)}>{nodes}</div>;
}

export default MessageContent;