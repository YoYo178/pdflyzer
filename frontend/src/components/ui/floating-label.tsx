import type { ComponentType } from 'react';

import { cn } from '@/lib/utils';

interface FloatingLabelProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  className?: string;
}

function FloatingLabel({ icon: Icon, title, subtitle, className }: FloatingLabelProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl',
        className,
      )}
    >
      <Icon className="h-4 w-4 text-teal-600 dark:text-teal-300" />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

export default FloatingLabel;