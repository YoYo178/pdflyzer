import LoadingSpinner from './LoadingSpinner';

interface InlineLoadingProps {
  text?: string;
  className?: string;
}

function InlineLoading({ text = 'Loading...', className }: InlineLoadingProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-2">
        <LoadingSpinner size="sm" />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    </div>
  );
}

export default InlineLoading;
