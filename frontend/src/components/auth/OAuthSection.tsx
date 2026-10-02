import { isOAuthEnabled, startOAuth } from '@/api/handlers/auth/oauth';
import type { TOAuthMode, TOAuthProvider } from '@/api/handlers/auth/types';
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconLoader2,
} from '@tabler/icons-react';
import { useState, type ComponentType } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface IProviderOption {
  id: TOAuthProvider;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const PROVIDERS: readonly IProviderOption[] = [
  { id: 'google', label: 'Google', Icon: IconBrandGoogleFilled },
  { id: 'github', label: 'GitHub', Icon: IconBrandGithubFilled },
];

const HINTS: Record<TOAuthMode, string> = {
  login: 'You will be redirected to your provider to finish signing in.',
  register: 'Your account is created automatically from your provider profile.',
};

interface OAuthSectionProps {
  mode: TOAuthMode;
}

function OAuthSection({ mode }: OAuthSectionProps) {
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
    <div className='mt-8'>
      <div className='flex items-center gap-3'>
        <span className='h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent' />
        <span className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground select-none'>
          or
        </span>
        <span className='h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent' />
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
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

      <p className='mt-5 text-pretty text-center text-xs leading-relaxed text-muted-foreground/80'>
        {HINTS[mode]}
      </p>
    </div>
  );
}

export { OAuthSection };
export default OAuthSection;
