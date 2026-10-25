import { IconEye, IconEyeOff } from '@tabler/icons-react';

function PasswordToggle({
  shown,
  onClick,
}: {
  shown: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={shown ? 'Hide password' : 'Show password'}
      title={shown ? 'Hide password' : 'Show password'}
      className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground'
    >
      {shown ? (
        <IconEyeOff className='h-4 w-4' />
      ) : (
        <IconEye className='h-4 w-4' />
      )}
    </button>
  );
}

export default PasswordToggle;
