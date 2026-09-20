import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}

function Badge({ children, icon: Icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-teal-600/25 bg-teal-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-teal-700 dark:border-teal-300/25 dark:bg-teal-300/[0.08] dark:text-teal-200',
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

export default Badge;