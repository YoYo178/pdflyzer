import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { IconX } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

interface DrawerProps {
  id?: string;
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  side?: 'left' | 'right';
}

function Drawer({ id, open, onClose, title, children, side = 'right' }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onRight = side === 'right';

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={{ x: onRight ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: onRight ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 320, mass: 0.9 }}
            className={cn(
              'absolute inset-y-0 flex w-[min(20rem,88vw)] flex-col border-border bg-background shadow-2xl outline-none',
              onRight ? 'right-0 border-l' : 'left-0 border-r',
            )}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              {title}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default Drawer;