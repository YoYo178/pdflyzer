import {
  IconArrowRight,
  IconArrowUpRight,
  IconBroadcast,
  IconChevronDown,
  IconFileDigit,
  IconFileText,
  IconKeyboard,
  IconListCheck,
  IconLogout,
  IconMessage2,
  IconMoon,
  IconSettings,
  IconSparkles,
  IconSun,
} from '@tabler/icons-react';

import { motion } from 'motion/react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import useTheme from '@/lib/useTheme';
import { cn } from '@/lib/utils';

const SOURCES = [
  { file: 'Service-Agreement-2025.pdf', page: 'Page 4', section: 'Invoicing', icon: IconFileText },
  { file: 'Statement-of-Work.pdf', page: 'Page 2', section: 'Milestone Payments', icon: IconFileDigit },
  { file: 'Renewal-Addendum.pdf', page: 'Page 6', section: 'Payment Terms', icon: IconFileDigit },
];

const DOCS = [
  { name: 'Service Agreement', meta: 'PDF · 48 pages', icon: IconFileText },
  { name: 'Statement of Work', meta: 'PDF · 12 pages', icon: IconFileText },
  { name: 'Renewal Addendum', meta: 'PDF · 6 pages', icon: IconFileText },
];

function Avatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 font-bold text-white',
        className ?? 'h-8 w-8 text-[10px]',
      )}
    >
      AK
    </span>
  );
}

function UserMenu() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <DropdownMenu
      className="ml-auto"
      menuClassName="w-60"
      triggerClassName="flex items-center gap-2 rounded-full border border-border bg-secondary/40 p-1 transition-colors hover:bg-secondary sm:py-1 sm:pl-1 sm:pr-2.5"
      trigger={
        <>
          <Avatar className="h-6 w-6 text-[9px]" />
          <span className="hidden text-xs font-medium text-foreground sm:block">Anna Kim</span>
          <IconChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-lg px-2.5 py-2">
        <Avatar />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Anna Kim</p>
          <p className="truncate text-xs text-muted-foreground">anna@pdflyzer.app</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem icon={<IconSettings />}>Settings</DropdownMenuItem>
      <DropdownMenuItem icon={<IconKeyboard />}>Keyboard shortcuts</DropdownMenuItem>
      <DropdownMenuItem onClick={toggle} icon={isDark ? <IconSun /> : <IconMoon />}>
        {isDark ? 'Light mode' : 'Dark mode'}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" icon={<IconLogout />}>
        Sign out
      </DropdownMenuItem>
    </DropdownMenu>
  );
}

function ChatMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_120px_-30px_rgba(45,212,191,0.25)] backdrop-blur-xl">
      {/* window bar */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="hidden gap-1.5 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-400/70" />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-1 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-300" />
          pdflyzer.app/chat/contracts
        </div>
        <UserMenu />
      </div>

      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* sidebar */}
        <aside className="hidden border-r border-border bg-secondary/20 p-3 lg:block">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Chats
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-2.5 py-2 text-xs font-medium text-foreground">
              <IconMessage2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-300" />
              Supplier contract Q&A
            </div>
            <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-muted-foreground">
              <IconMessage2 className="h-3.5 w-3.5" />
              Annual report 2025
            </div>
            <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-muted-foreground">
              <IconMessage2 className="h-3.5 w-3.5" />
              Compliance review
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Documents
            </p>
            <div className="space-y-1.5">
              {DOCS.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5"
                >
                  <d.icon className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-300" />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] text-foreground">{d.name}</p>
                    <p className="text-[9px] text-muted-foreground">{d.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* conversation */}
        <div className="min-w-0 p-4 sm:p-6">
          <div className="mx-auto max-w-[560px] space-y-5">
            {/* user bubble */}
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-teal-600/30 bg-teal-500/10 px-4 py-2.5 text-sm leading-relaxed text-foreground dark:border-teal-300/25 dark:bg-teal-300/10">
                What are the payment terms in both contracts, and do they change on renewal?
              </div>
            </div>

            {/* assistant bubble */}
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700 ring-1 ring-teal-600/30 dark:bg-teal-300/15 dark:text-teal-300 dark:ring-teal-300/30">
                <IconSparkles className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 max-w-[88%] space-y-3">
                <div className="rounded-2xl rounded-tl-sm border border-border bg-secondary/60 px-4 py-3.5 text-sm leading-relaxed text-muted-foreground">
                  <p className="text-foreground">
                    Per the Service Agreement, invoices are due{' '}
                    <span className="rounded bg-teal-500/15 px-1 font-medium text-foreground dark:bg-teal-300/15">
                      within 30 days
                    </span>{' '}
                    <sup className="text-[10px] text-teal-600 dark:text-teal-300">[1]</sup>. The
                    Statement of Work adds a{' '}
                    <span className="rounded bg-teal-500/15 px-1 font-medium text-foreground dark:bg-teal-300/15">
                      20% deposit upfront
                    </span>{' '}
                    <sup className="text-[10px] text-teal-600 dark:text-teal-300">[2]</sup>, while
                    the Renewal Addendum extends net terms to{' '}
                    <span className="rounded bg-teal-500/15 px-1 font-medium text-foreground dark:bg-teal-300/15">
                      45 days
                    </span>{' '}
                    for the second year{' '}
                    <sup className="text-[10px] text-teal-600 dark:text-teal-300">[3]</sup>.
                  </p>

                  {/* sources */}
                  <div className="mt-4 space-y-1.5 border-t border-border pt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <IconListCheck className="h-3 w-3" /> Sources
                    </p>
                    {SOURCES.map((s, i) => (
                      <div
                        key={s.file}
                        className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-2.5 py-2"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-teal-500/15 text-[9px] font-bold text-teal-700 dark:bg-teal-300/15 dark:text-teal-300">
                          {i + 1}
                        </span>
                        <s.icon className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-300" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-medium text-foreground">
                            {s.file}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {s.page} · {s.section}
                          </p>
                        </div>
                        <IconArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* streaming line */}
                <div className="text-[13px] font-medium leading-relaxed">
                  <motion.span
                    className="bg-gradient-to-r from-teal-700 via-zinc-500 to-teal-700 bg-clip-text text-transparent dark:from-teal-300 dark:via-zinc-400 dark:to-teal-300"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                  >
                    Verifying 2 more clauses against your attachments
                  </motion.span>
                  <motion.span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[1em] w-[5px] rounded-[1px] bg-teal-500 align-text-top dark:bg-teal-300"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <IconBroadcast className="h-3 w-3" />
                  streamed over WebSocket in 0.6s
                </div>
              </div>
            </div>

            {/* input */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 px-4 py-3">
              <span className="flex-1 truncate text-xs text-muted-foreground">
                Ask another question…
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white dark:bg-teal-300 dark:text-zinc-950">
                <IconArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMock;