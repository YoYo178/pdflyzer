import type { TOAuthMode } from '@/api/handlers/auth/types';
import { IconMail } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { OAuthButtons } from './OAuthButtons';

const HINTS: Record<TOAuthMode, string> = {
  login: 'You will be redirected to your provider to finish signing in.',
  register: 'Your account is created automatically from your provider profile.',
};

/**
 * `featured` promotes the email option above a separator, `plain` lists every
 * method with the same visual weight.
 */
type TAuthLayout = 'featured' | 'plain';

interface AuthOptionsProps {
  mode: TOAuthMode;
  layout?: TAuthLayout;
  onSelectEmail: () => void;
}

function AuthHint({ mode }: { mode: TOAuthMode }) {
  return (
    <p className='mt-5 text-pretty text-center text-xs leading-relaxed text-muted-foreground/80'>
      {HINTS[mode]}
    </p>
  );
}

function AuthOptions({ mode, onSelectEmail }: AuthOptionsProps) {
  return (
    <div className='text-left'>
      <Button
        type='button'
        variant='brand'
        size='lg'
        onClick={onSelectEmail}
        className='h-12 w-full'
      >
        <IconMail className='h-4 w-4' />
        Continue with email
      </Button>

      <div className='my-6 flex items-center gap-3'>
        <span className='h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent' />
        <span className='text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase select-none'>
          or
        </span>
        <span className='h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent' />
      </div>

      <OAuthButtons mode={mode} />

      <AuthHint mode={mode} />
    </div>
  );
}

export default AuthOptions;
