import { memo, useMemo } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

const CITATION_TOKEN = /\[\[(\d+)\]\]/g;
const CITE_PREFIX = '#cite-';

/**
 * Inline citations arrive as `[[3]]`. Markdown has no such syntax, so they are
 * rewritten into in-document fragment links, which survive GFM parsing and the
 * sanitizer (fragments need no protocol) and can then be mapped to real buttons.
 */
function withCitationLinks(markdown: string) {
  return markdown.replace(
    CITATION_TOKEN,
    (_match, index: string) => `[${index}](${CITE_PREFIX}${index})`,
  );
}

function citationIndex(href?: string) {
  if (!href?.startsWith(CITE_PREFIX)) return null;

  const value = Number(href.slice(CITE_PREFIX.length));
  return Number.isInteger(value) && value > 0 ? value : null;
}

const HEADING = 'font-semibold tracking-tight text-foreground';
const MARKER = '[&>li::marker]:text-teal-600 dark:[&>li::marker]:text-teal-300';

function useComponents(onCitationClick: (index: number) => void): Components {
  return useMemo(
    () => ({
      a({ children, href }) {
        const index = citationIndex(href);

        if (index !== null) {
          return (
            <button
              type='button'
              onClick={() => onCitationClick(index)}
              aria-label={`Jump to source ${index}`}
              className='mx-0.5 rounded px-0.5 align-super text-[10px] font-semibold text-teal-600 transition-colors hover:bg-teal-500/15 dark:text-teal-300'
            >
              [{index}]
            </button>
          );
        }

        return (
          <a
            href={href}
            target='_blank'
            rel='noreferrer noopener'
            className='font-medium text-teal-600 underline underline-offset-2 hover:bg-teal-500/10 dark:text-teal-300'
          >
            {children}
          </a>
        );
      },

      p: ({ children }) => <p className='leading-relaxed'>{children}</p>,

      h1: ({ children }) => (
        <h3 className={cn('mt-1 text-xl', HEADING)}>{children}</h3>
      ),
      h2: ({ children }) => (
        <h3 className={cn('mt-1 text-lg', HEADING)}>{children}</h3>
      ),
      h3: ({ children }) => (
        <h4 className={cn('mt-1 text-base', HEADING)}>{children}</h4>
      ),
      h4: ({ children }) => (
        <h5 className={cn('mt-1 text-[15px]', HEADING)}>{children}</h5>
      ),
      h5: ({ children }) => <h6 className={cn('text-sm', HEADING)}>{children}</h6>,
      h6: ({ children }) => (
        <h6 className={cn('text-xs uppercase tracking-wide', HEADING)}>
          {children}
        </h6>
      ),

      ul: ({ children }) => (
        <ul className={cn('list-disc space-y-2 pl-1', MARKER)}>{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className={cn('list-decimal space-y-2 pl-1', MARKER)}>{children}</ol>
      ),
      li: ({ children, className }) => {
        // remark-gfm puts `task-list-item` on the li and already renders the
        // checkbox, so drop the marker and tint it rather than adding another.
        const isTask =
          typeof className === 'string' && className.includes('task-list-item');

        return (
          <li
            className={cn(
              isTask
                ? 'list-none pl-0 [&_input[type=checkbox]]:mr-1.5 [&_input[type=checkbox]]:h-3.5 [&_input[type=checkbox]]:w-3.5 [&_input[type=checkbox]]:translate-y-0.5 [&_input[type=checkbox]]:accent-teal-600 dark:[&_input[type=checkbox]]:accent-teal-300'
                : 'pl-1',
              className,
            )}
          >
            {children}
          </li>
        );
      },

      blockquote: ({ children }) => (
        <blockquote className='border-l-2 border-teal-600/40 pl-3 italic text-muted-foreground dark:border-teal-300/40'>
          {children}
        </blockquote>
      ),

      strong: ({ children }) => (
        <strong className='font-semibold text-foreground'>{children}</strong>
      ),
      em: ({ children }) => <em className='italic'>{children}</em>,
      del: ({ children }) => (
        <del className='text-muted-foreground/70'>{children}</del>
      ),

      code: ({ children, className }) => (
        <code
          className={cn(
            'rounded bg-secondary px-1 py-0.5 font-mono text-[0.85em] text-foreground',
            // Inside a fenced block the <pre> owns the chrome.
            '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
            className,
          )}
        >
          {children}
        </code>
      ),
      pre: ({ children }) => (
        <pre className='scrollbar-slim overflow-x-auto rounded-xl border border-border bg-secondary/50 p-3 text-xs leading-relaxed'>
          {children}
        </pre>
      ),

      // GFM tables can overflow narrow bubbles, so the wrapper scrolls instead.
      table: ({ children }) => (
        <div className='scrollbar-slim -mx-1 overflow-x-auto px-1'>
          <table className='w-full border-collapse text-xs'>{children}</table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className='bg-secondary/40'>{children}</thead>
      ),
      th: ({ children }) => (
        <th className='border-b border-border px-3 py-2 text-left font-semibold text-foreground'>
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className='border-b border-border/60 px-3 py-2 align-top'>
          {children}
        </td>
      ),

      hr: () => <hr className='border-border' />,
    }),
    [onCitationClick],
  );
}

interface MessageContentProps {
  content: string;
  onCitationClick: (index: number) => void;
  className?: string;
}

function MessageContent({
  content,
  onCitationClick,
  className,
}: MessageContentProps) {
  const components = useComponents(onCitationClick);
  const source = useMemo(() => withCitationLinks(content), [content]);

  return (
    <div className={cn('space-y-4 text-pretty', className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={components}
        // Raw HTML in LLM output is never rendered.
        skipHtml
      >
        {source}
      </Markdown>
    </div>
  );
}

export default memo(MessageContent);