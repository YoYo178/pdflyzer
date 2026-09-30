import {
  IconArrowUpRight,
  IconDots,
  IconFileText,
  IconMessage2,
  IconPaperclip,
  IconPin,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { useMemo } from 'react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MOCK_USAGE } from './mock-chat';
import type { IChat, IDocument } from '@/types/chat.types';
import { cn } from '@/lib/utils';

const BUCKETS = ['Pinned', 'Today', 'Yesterday', 'Previous 7 days', 'Earlier'] as const;

function bucketOf(chat: IChat) {
  if (chat.pinned) return 'Pinned';

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days = Math.floor((startOfToday.getTime() - new Date(chat.updatedAt).getTime()) / 86_400_000);

  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return 'Previous 7 days';
  return 'Earlier';
}

function relativeTime(iso: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function DocumentRow({ document }: { document: IDocument }) {
  return (
    <li className="group flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5">
      <IconFileText
        className={cn(
          'h-3.5 w-3.5 shrink-0',
          document.status === 'ready'
            ? 'text-teal-600 dark:text-teal-300'
            : 'text-muted-foreground',
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-foreground">{document.name}</p>
        {document.status === 'ready' ? (
          <p className="text-[9px] text-muted-foreground">
            PDF · {document.pages} pages
          </p>
        ) : (
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-border">
              <span
                className="block h-full rounded-full bg-teal-500 transition-[width] duration-500 dark:bg-teal-300"
                style={{ width: `${document.progress ?? 0}%` }}
              />
            </span>
            <span className="text-[9px] tabular-nums text-muted-foreground">
              {document.progress ?? 0}%
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

interface AppSidebarProps {
  chats: IChat[];
  documents: IDocument[];
  activeChatId: string | null;
  query: string;
  onQueryChange: (query: string) => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRequestUpload: () => void;
}

function AppSidebar({
  chats,
  documents,
  activeChatId,
  query,
  onQueryChange,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRequestUpload,
}: AppSidebarProps) {
  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? chats.filter((chat) => chat.title.toLowerCase().includes(needle))
      : chats;

    return BUCKETS.map((bucket) => ({
      bucket,
      items: filtered.filter((chat) => bucketOf(chat) === bucket),
    })).filter((group) => group.items.length > 0);
  }, [chats, query]);

  const usage = Math.min(100, Math.round((MOCK_USAGE.pages / MOCK_USAGE.limit) * 100));

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-3" aria-label="Chats and documents">
      <button
        type="button"
        onClick={onNewChat}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar dark:bg-teal-300 dark:text-zinc-950 dark:shadow-teal-300/20 dark:hover:bg-teal-200"
      >
        <IconPlus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
        New chat
      </button>

      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search chats"
          aria-label="Search chats"
          className="h-9 w-full rounded-xl border border-border bg-secondary/20 pl-9 pr-3 text-xs text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-teal-500/60 focus:bg-secondary/40 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:focus:border-teal-300/40 dark:focus:ring-teal-300/10"
        />
      </div>

      <div className="scrollbar-slim -mr-1 min-h-0 flex-1 overflow-y-auto pr-1">
        {grouped.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No chats match “{query.trim()}”
          </p>
        ) : (
          grouped.map((group) => (
            <div key={group.bucket} className="mb-4 last:mb-0">
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {group.bucket}
              </p>

              <ul className="space-y-0.5">
                {group.items.map((chat) => {
                  const isActive = chat.id === activeChatId;

                  return (
                    <li key={chat.id} className="group/row group-focus-within/row relative">
                      <button
                        type="button"
                        onClick={() => onSelectChat(chat.id)}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg py-2 pl-2.5 pr-9 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          isActive
                            ? 'bg-secondary font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                        )}
                      >
                        <IconMessage2
                          className={cn(
                            'h-3.5 w-3.5 shrink-0',
                            isActive
                              ? 'text-teal-600 dark:text-teal-300'
                              : 'text-muted-foreground',
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{chat.title}</span>
                        {chat.pinned && (
                          <IconPin className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                        )}
                      </button>

                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] tabular-nums text-muted-foreground/70 group-hover/row:opacity-0">
                        {relativeTime(chat.updatedAt)}
                      </span>

                      <DropdownMenu
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        triggerClassName="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground focus-visible:opacity-100 group-hover/row:opacity-100 group-focus-within/row:opacity-100 [@media(hover:none)]:opacity-100"
                        menuClassName="w-44"
                        trigger={<IconDots className="h-3.5 w-3.5" />}
                      >
                        <div className="px-3 py-2 text-[11px] text-muted-foreground">
                          Updated {relativeTime(chat.updatedAt)} ago
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          icon={<IconArrowUpRight />}
                          onClick={() => onSelectChat(chat.id)}
                        >
                          Open chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          icon={<IconTrash />}
                          onClick={() => onDeleteChat(chat.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenu>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="shrink-0 border-t border-border pt-3">
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Documents
          </p>
          <button
            type="button"
            onClick={() => onRequestUpload()}
            className="text-[10px] font-medium text-teal-600 transition-colors hover:underline dark:text-teal-300"
          >
            Upload
          </button>
        </div>

        <ul className="space-y-1.5">
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onRequestUpload()}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-[11px] text-muted-foreground transition-colors hover:border-teal-600/50 hover:text-foreground dark:hover:border-teal-300/50"
        >
          <IconPaperclip className="h-3 w-3" />
          Add a PDF
        </button>
      </div>

      <div className="shrink-0 rounded-xl border border-border bg-secondary/40 p-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-medium text-foreground">Pages indexed</p>
          <p className="text-[10px] tabular-nums text-muted-foreground">
            {MOCK_USAGE.pages.toLocaleString()} / {MOCK_USAGE.limit.toLocaleString()}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
            style={{ width: `${usage}%` }}
          />
        </div>
      </div>
    </nav>
  );
}

export default AppSidebar;