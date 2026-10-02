import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/ui/logo';
import {
  formatAbsoluteTime,
  formatBytes,
  formatFileCount,
  formatRelativeTime,
} from '@/lib/format';
import { cn } from '@/lib/utils';
import type { IChat } from '@/types/chat.types';
import type { IDocument } from '@/types/document.types';
import {
  IconChevronDown,
  IconDots,
  IconFileText,
  IconPaperclip,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { useMemo, useRef, useState } from 'react';

const BUCKETS = [
  'Pinned',
  'Today',
  'Yesterday',
  'Previous 7 days',
  'Earlier',
] as const;

type TBucket = (typeof BUCKETS)[number];

function bucketOf(chat: IChat): TBucket {
  if (chat.pinned) return 'Pinned';

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days = Math.floor(
    (startOfToday.getTime() - new Date(chat.updated_at).getTime()) / 86_400_000,
  );

  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return 'Previous 7 days';
  return 'Earlier';
}

interface AppSidebarProps {
  chats: IChat[];
  documents: IDocument[];
  activeChatId: string | null;
  hasActiveChat: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onRenameChat: (id: string, name: string) => void;
  onDeleteChat: (id: string) => void;
  onAddDocuments: (files: File[]) => void;
  onDeleteDocument: (id: string) => void;
}

function AppSidebar({
  chats,
  documents,
  activeChatId,
  hasActiveChat,
  query,
  onQueryChange,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  onAddDocuments,
  onDeleteDocument,
}: AppSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const cancelRenameRef = useRef(false);

  const [documentsOpen, setDocumentsOpen] = useState(false);

  // A failed document is the one case worth interrupting the user for.
  const showDocuments =
    documentsOpen || documents.some((document) => document.status === 'FAILED');

  const needle = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const filtered = needle
      ? chats.filter((chat) => chat.name.toLowerCase().includes(needle))
      : chats;

    return BUCKETS.map((bucket) => ({
      bucket,
      items: filtered.filter((chat) => bucketOf(chat) === bucket),
    })).filter((group) => group.items.length > 0);
  }, [chats, needle]);

  function startRename(chat: IChat) {
    cancelRenameRef.current = false;
    setDraftTitle(chat.name);
    setRenamingId(chat._id);
  }

  function cancelRename() {
    cancelRenameRef.current = true;
    setRenamingId(null);
  }

  function commitRename() {
    const id = renamingId;
    const title = draftTitle.trim();

    cancelRenameRef.current = false;
    setRenamingId(null);

    if (id && title) onRenameChat(id, title);
  }

  function renderChatRow(chat: IChat) {
    const isRenaming = renamingId === chat._id;

    return (
      <li
        key={chat._id}
        className='group/row group-focus-within/row relative'
        title={formatAbsoluteTime(chat.updated_at)}
      >
        <div
          className={cn(
            'relative flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors',
            'hover:bg-secondary focus-within:bg-secondary',
            activeChatId === chat._id && 'bg-secondary',
          )}
        >
          {isRenaming ? (
            <input
              autoFocus
              value={draftTitle}
              aria-label='Rename chat'
              onChange={(event) => setDraftTitle(event.target.value)}
              onFocus={(event) => event.currentTarget.select()}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitRename();
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  cancelRename();
                }
              }}
              className='-my-1 w-full min-w-0 flex-1 truncate rounded border border-teal-600/40 bg-background px-1.5 py-1 text-xs font-medium text-foreground outline-none'
            />
          ) : (
            <button
              type='button'
              onClick={() => onSelectChat(chat._id)}
              aria-current={activeChatId === chat._id ? 'page' : undefined}
              className='min-w-0 flex-1 pr-[4.75rem] text-left'
            >
              <span
                className={cn(
                  'block truncate text-xs',
                  activeChatId === chat._id
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {chat.name}
              </span>
            </button>
          )}

          {!isRenaming && (
            <div className='absolute right-1.5 flex shrink-0 items-center gap-0.5'>
              <span className='pointer-events-none whitespace-nowrap text-[10px] tabular-nums text-muted-foreground/60 transition-opacity duration-150 group-hover/row:opacity-0 group-focus-within/row:opacity-0'>
                {formatRelativeTime(chat.updated_at)}
              </span>

              <div className='flex shrink-0 items-center opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 group-focus-within/row:opacity-100 focus-within:opacity-100 group-focus-within/row:pointer-events-auto pointer-events-auto [@media(hover:none)]:opacity-100'>
                <DropdownMenu
                  align='end'
                  menuClassName='w-52'
                  triggerClassName='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:opacity-100 focus-visible:outline-none'
                  trigger={<IconDots className='h-3.5 w-3.5' />}
                >
                  <DropdownMenuItem
                    icon={<IconPencil />}
                    onClick={() => startRename(chat)}
                  >
                    Rename chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant='destructive'
                    icon={<IconTrash />}
                    onClick={() => onDeleteChat(chat._id)}
                  >
                    Delete chat
                  </DropdownMenuItem>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </li>
    );
  }

  return (
    <nav
      className='flex h-full min-h-0 flex-col bg-background'
      aria-label='Chats and documents'
    >
      <div className='flex shrink-0 items-center justify-between px-4 py-4'>
        <Logo size='sm' className='px-1' />
      </div>

      <div className='shrink-0 px-3 pb-2'>
        <label className='relative block'>
          <span className='sr-only'>Search chats</span>
          <IconSearch className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
          <input
            type='search'
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder='Search chats'
            className='w-full rounded-lg border border-transparent bg-secondary/60 py-2 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 focus-visible:border-teal-600/40 focus-visible:bg-secondary focus-visible:outline-none'
          />
        </label>
      </div>

      <div className='shrink-0 px-3 pb-2'>
        <button
          type='button'
          onClick={onNewChat}
          className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-teal-500/10 focus-visible:bg-teal-500/10 focus-visible:outline-none dark:hover:bg-teal-300/10 dark:focus-visible:bg-teal-300/10'
        >
          <IconPlus className='h-3.5 w-3.5 text-teal-600 dark:text-teal-300' />
          New chat
        </button>
      </div>

      <div className='scrollbar-slim min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-3'>
        {groups.length === 0 ? (
          <p className='px-2.5 py-1 text-xs text-muted-foreground'>
            {needle ? `No chats match “${query.trim()}”.` : 'No chats yet.'}
          </p>
        ) : (
          groups.map(({ bucket, items }) => (
            <div key={bucket} className='space-y-0.5'>
              <p className='px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70'>
                {bucket}
              </p>
              <ul className='space-y-0.5'>{items.map(renderChatRow)}</ul>
            </div>
          ))
        )}
      </div>

      {/* TODO: make it show summary of documents on the heading: i.e "5 Parsed | 1 Failed" or "5 Documents", etc */}
      {hasActiveChat && (
        <section
          className={cn(
            'flex min-h-0 flex-col border-t border-border',
            showDocuments && documents.length > 0 && 'flex-[0_0_38%]',
            !showDocuments && 'shrink-0',
          )}
        >
          <div className='flex shrink-0 items-center gap-1 px-3 py-2.5'>
            <button
              type='button'
              onClick={() => setDocumentsOpen((open) => !open)}
              aria-expanded={showDocuments}
              className='flex min-w-0 items-center gap-1.5 rounded-md px-1 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none'
            >
              <IconChevronDown
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform',
                  !showDocuments && '-rotate-90',
                )}
              />
              <span className='truncate'>
                {formatFileCount(documents.length)}
              </span>
            </button>

            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              aria-label='Add a PDF'
              title='Add a PDF'
              className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none'
            >
              <IconPaperclip className='h-3.5 w-3.5' />
            </button>

            <input
              ref={fileInputRef}
              type='file'
              accept='application/pdf,.pdf'
              multiple
              className='hidden'
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length > 0) onAddDocuments(files);
                event.target.value = '';
              }}
            />
          </div>

          {showDocuments && (
            <div className='scrollbar-slim min-h-0 flex-1 overflow-y-auto px-3 pb-3'>
              {documents.length === 0 ? (
                <p className='px-1 py-1 text-xs text-muted-foreground'>
                  No PDFs in this chat yet.
                </p>
              ) : (
                <ul className='space-y-1'>
                  {documents.map((document) => (
                    <DocumentRow
                      key={document._id}
                      document={document}
                      onDelete={onDeleteDocument}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}
    </nav>
  );
}

const DOCUMENT_STATUS_LABEL: Record<IDocument['status'], string> = {
  QUEUED: 'Queued',
  PROCESSING: 'Processing',
  READY: 'Ready',
  FAILED: 'Failed',
};

interface DocumentRowProps {
  document: IDocument;
  onDelete: (id: string) => void;
}

function DocumentRow({ document, onDelete }: DocumentRowProps) {
  const isFailed = document.status === 'FAILED';
  const isProcessing = document.status === 'PROCESSING';
  const isReady = document.status === 'READY';

  return (
    <li className='group/doc relative rounded-lg px-2.5 py-2 transition-colors hover:bg-secondary/70'>
      <div className='flex items-start gap-2'>
        <IconFileText
          className={cn(
            'mt-0.5 h-3.5 w-3.5 shrink-0',
            isFailed
              ? 'text-destructive/80'
              : isReady
                ? 'text-teal-600 dark:text-teal-300'
                : 'text-muted-foreground/70',
          )}
        />

        <div className='min-w-0 flex-1'>
          <p
            className={cn(
              'truncate text-xs font-medium',
              isFailed ? 'text-destructive' : 'text-foreground',
            )}
            title={document.filename}
          >
            {document.filename}
          </p>

          {isReady ? (
            <p className='mt-0.5 truncate text-[10px] text-muted-foreground'>
              {document.pages} pages · {formatBytes(document.size)}
            </p>
          ) : (
            <p
              className={cn(
                'mt-0.5 truncate text-[10px]',
                isFailed ? 'text-destructive/80' : 'text-muted-foreground',
              )}
            >
              {DOCUMENT_STATUS_LABEL[document.status]}
              {isFailed ? ' — could not be read' : ''}
            </p>
          )}

          {isProcessing && (
            <span className='relative mt-1.5 block h-1 overflow-hidden rounded-full bg-border'>
              <span className='progress-indeterminate absolute inset-y-0 left-0 w-1/3 rounded-full bg-teal-600 dark:bg-teal-300' />
            </span>
          )}
        </div>

        <div className='flex shrink-0 items-center opacity-0 transition-opacity group-hover/doc:opacity-100 group-focus-within/doc:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100'>
          <button
            type='button'
            aria-label={`Delete ${document.filename}`}
            onClick={() => onDelete(document._id)}
            className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive focus-visible:bg-accent focus-visible:text-destructive focus-visible:opacity-100 focus-visible:outline-none'
          >
            <IconTrash className='h-3.5 w-3.5' />
          </button>
        </div>
      </div>
    </li>
  );
}

export default AppSidebar;
