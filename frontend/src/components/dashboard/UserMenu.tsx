import { useLogout } from '@/api/mutations/auth/useLogout';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Blobatar } from '@blobatar/react';
import { useGaze } from '@blobatar/react/gaze';
import {
  IconChevronDown,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import 'blobatar/gaze.css';
import 'blobatar/motion.css';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

interface UserMenuProps {
  className?: string;
  triggerClassName?: string;
}

function Avatar({
  className,
  followPointer = false,
}: {
  className?: string;
  followPointer?: boolean;
}) {
  const { ref } = useGaze({ travel: 15, lookAt: 'pointer' });
  const { user } = useAuth();

  if (!user) return;

  return (
    <Blobatar
      ref={followPointer ? ref : undefined}
      name={user.name ?? ''}
      animate='always'
      className={cn(
        'flex shrink-0 items-center justify-center',
        className ?? 'h-10 w-10 text-[10px]',
      )}
    />
  );
}

function UserMenu({ className, triggerClassName }: UserMenuProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const { user } = useAuth();

  const { mutateAsync } = useLogout();

  const handleLogout = useCallback(async () => {
    await mutateAsync();

    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    navigate('/');
  }, [queryClient, mutateAsync, navigate]);

  if (!user) return;

  return (
    <DropdownMenu
      className={className}
      menuClassName='w-60'
      triggerClassName={cn(
        'flex items-center gap-2 rounded-full border border-border bg-secondary/40 p-1 transition-colors hover:border-teal-600/40 hover:bg-secondary dark:hover:border-teal-300/40 sm:py-1 sm:pl-1 sm:pr-2.5',
        triggerClassName,
      )}
      trigger={
        <>
          <Avatar className='h-6 w-6 text-[9px]' />
          <span className='hidden text-xs font-medium text-foreground sm:block'>
            {user.name}
          </span>
          <IconChevronDown className='hidden h-3.5 w-3.5 text-muted-foreground sm:block' />
        </>
      }
    >
      <div className='flex items-center gap-3 rounded-lg px-2.5 py-2'>
        <Avatar followPointer />
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-foreground'>
            {user.name}
          </p>
          <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        icon={isDark ? <IconSun /> : <IconMoon />}
      >
        {isDark ? 'Light mode' : 'Dark mode'}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        icon={<IconLogout />}
        onClick={handleLogout}
      >
        Sign out
      </DropdownMenuItem>
    </DropdownMenu>
  );
}

export default UserMenu;
