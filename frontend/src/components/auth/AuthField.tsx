import {
  type ComponentType,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
}

function AuthField({
  label,
  icon: Icon,
  hint,
  error,
  trailing,
  id,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className='space-y-2'>
      <label
        htmlFor={id}
        className='block text-[13px] font-medium text-foreground'
      >
        {label}
      </label>

      <div className='group relative'>
        <Icon className='pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors z-1 group-focus-within:text-teal-500 dark:group-focus-within:text-teal-300' />

        <input
          id={id}
          className={cn(
            'h-11 w-full rounded-xl border bg-secondary/20 pl-10 text-sm text-foreground backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground/50',
            'border-border',
            'focus:border-teal-500/60 focus:bg-secondary/40 focus:outline-none focus:ring-4 focus:ring-teal-500/10',
            'dark:focus:border-teal-300/40 dark:focus:ring-teal-300/10',
            error &&
              'border-destructive/70 focus:border-destructive focus:ring-destructive/10',
            trailing ? 'pr-11' : 'pr-3.5',
            className,
          )}
          {...props}
        />

        {trailing && (
          <div className='absolute right-2 top-1/2 -translate-y-1/2'>
            {trailing}
          </div>
        )}
      </div>

      {error ? (
        <p className='text-xs text-destructive'>{error}</p>
      ) : hint ? (
        <p className='text-xs text-muted-foreground/80'>{hint}</p>
      ) : null}
    </div>
  );
}

export default AuthField;
