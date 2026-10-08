import { startOAuth } from '@/api/handlers/auth/oauth';
import type { TOAuthMode, TOAuthProvider } from '@/api/handlers/auth/types';
import {
  isOAuthEnabled,
  PROVIDERS,
  type IProviderOption,
} from '@/config/oauth.config';
import { cn } from '@/lib/utils';
import { IconLoader2 } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface OAuthButtonsProps {
  mode: TOAuthMode;
  className?: string;
}

function OAuthButtons({ mode, className }: OAuthButtonsProps) {
  const [pending, setPending] = useState<TOAuthProvider | null>(null);

  function onSelect(provider: IProviderOption) {
    if (!isOAuthEnabled) {
      toast.info(`${provider.label} sign-in is not enabled yet.`, {
        position: 'bottom-center',
      });
      return;
    }

    setPending(provider.id);
    startOAuth(provider.id, mode);
  }

  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {PROVIDERS.map((provider) => {
        const { id, label, Icon } = provider;
        const isPending = pending === id;

        return (
          <Button
            key={id}
            type='button'
            variant='outline'
            disabled={pending !== null}
            aria-label={`Continue with ${label}`}
            onClick={() => onSelect(provider)}
            className='h-11 w-full font-medium hover:border-teal-600/40 hover:bg-secondary/40 hover:text-teal-600 dark:hover:border-teal-300/40 dark:hover:text-teal-300'
          >
            {isPending ? (
              <IconLoader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Icon className='h-4 w-4' />
            )}
            {isPending ? 'Redirecting…' : label}
          </Button>
        );
      })}
    </div>
  );
}

export default OAuthButtons;
