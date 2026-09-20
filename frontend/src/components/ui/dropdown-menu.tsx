import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  trigger: ReactNode;
  triggerClassName?: string;
  className?: string;
  menuClassName?: string;
  align?: 'start' | 'end';
  children: ReactNode;
}

function DropdownMenu({
  trigger,
  triggerClassName,
  className,
  menuClassName,
  align = 'end',
  children,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {/*
       * AnimatePresence keeps the menu mounted briefly during exit so the
       * close animation can play.
       */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute top-full z-10 mt-2 min-w-56 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl',
              align === 'end' ? 'right-0' : 'left-0',
              menuClassName,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DropdownMenuItemProps extends ComponentProps<'button'> {
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
}

function DropdownMenuItem({
  icon,
  variant = 'default',
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        variant === 'destructive'
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-foreground hover:bg-secondary',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 opacity-70 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {children}
    </button>
  );
}

function DropdownMenuSeparator() {
  return <div role="separator" className="my-1.5 h-px bg-border" />;
}

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator };