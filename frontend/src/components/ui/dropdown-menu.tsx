import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

const OFFSET = 8;
const MIN_SPACE = 200;
const MENU_Z = 70;

interface DropdownMenuProps {
  trigger: ReactNode;
  triggerClassName?: string;
  className?: string;
  menuClassName?: string;
  align?: 'start' | 'end';
  children: ReactNode;
}

interface IMenuPosition {
  top?: number;
  bottom?: number;
  left: number;
}

const DropdownMenuContext = createContext<{ close: () => void } | null>(null);

function useDropdownMenu() {
  return useContext(DropdownMenuContext);
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
  const [position, setPosition] = useState<IMenuPosition | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef<IMenuPosition | null>(null);

  /*
   * The menu is portalled to <body> and positioned with `fixed`, so it can
   * never be clipped by a scrolling ancestor or painted underneath one.
   */
  const place = useCallback(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    const rect = triggerElement.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const flip = spaceBelow < MIN_SPACE && rect.top > spaceBelow;

    const rawLeft = align === 'end' ? rect.right - menuWidth : rect.left;
    const gutter = Math.max(OFFSET, rawLeft);
    const maxLeft = Math.max(OFFSET, window.innerWidth - menuWidth - OFFSET);

    const next = {
      top: flip ? undefined : rect.bottom + OFFSET,
      bottom: flip ? window.innerHeight - rect.top + OFFSET : undefined,
      left: Math.min(gutter, maxLeft),
    };

    const last = lastPosition.current;
    if (
      last &&
      Math.abs((last.left ?? 0) - (next.left ?? 0)) < 1 &&
      Math.abs((last.top ?? -1) - (next.top ?? -1)) < 1 &&
      Math.abs((last.bottom ?? -1) - (next.bottom ?? -1)) < 1
    ) {
      return;
    }

    lastPosition.current = next;
    setPosition(next);
  }, [align]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const inside =
        rootRef.current?.contains(target) || menuRef.current?.contains(target);
      if (!inside) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    if (items.length === 0) return;

    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === 'Home') items[0].focus();
    else if (event.key === 'End') items[items.length - 1].focus();
    else if (event.key === 'ArrowDown') items[(current + 1 + items.length) % items.length].focus();
    else items[(current - 1 + items.length) % items.length].focus();
  }

  const value = useMemo(() => ({ close: () => setOpen(false) }), []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={triggerClassName}
      >
        {trigger}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              role="menu"
              onKeyDown={onMenuKeyDown}
              style={{
                position: 'fixed',
                top: position?.top,
                bottom: position?.bottom,
                left: position?.left ?? 0,
                zIndex: MENU_Z,
                visibility: position ? 'visible' : 'hidden',
                transformOrigin: align === 'end' ? 'top right' : 'top left',
              }}
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'min-w-56 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl outline-none',
                menuClassName,
              )}
            >
              <DropdownMenuContext.Provider value={value}>{children}</DropdownMenuContext.Provider>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
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
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const menu = useDropdownMenu();

  return (
    <button
      type="button"
      role="menuitem"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) menu?.close();
      }}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        'focus-visible:outline-none focus-visible:bg-secondary',
        variant === 'destructive'
          ? 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10'
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