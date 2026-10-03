import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <span
      className={cn(
        'animate-spin rounded-full border-2 border-border border-t-teal-600 dark:border-t-teal-300',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-5 w-5',
        size === 'lg' && 'h-8 w-8',
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export default LoadingSpinner;
