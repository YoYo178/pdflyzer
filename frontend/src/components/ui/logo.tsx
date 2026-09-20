import { IconFileText } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md';
}

function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'flex items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-400 text-emerald-950',
          size === 'sm' ? 'h-7 w-7' : 'h-8 w-8',
        )}
      >
        <IconFileText strokeWidth={2.25} className={size === 'sm' ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
      </span>
      <span
        className={cn(
          'font-semibold tracking-tight text-foreground',
          size === 'sm' ? 'text-sm' : 'text-[15px]',
        )}
      >
        pdf<span className="text-teal-600 dark:text-teal-300">lyzer</span>
      </span>
    </span>
  );
}

export default Logo;