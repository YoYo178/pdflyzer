import { useLogout } from '@/api/mutations/auth/useLogout';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  IconChevronDown,
  IconKeyboard,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

interface UserMenuProps {
  className?: string;
  triggerClassName?: string;
}

function Avatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 font-bold text-white',
        className ?? 'h-8 w-8 text-[10px]',
      )}
    >
      {MOCK_USER.initials}
    </span>
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
        <Avatar />
      <div className='flex items-center gap-3 rounded-lg px-2.5 py-2'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-foreground'>
            {user.name}
          </p>
          <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        icon={<IconSettings />}
        onClick={() => navigate('/settings')}
      >
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem icon={<IconKeyboard />}>
        Keyboard shortcuts
      </DropdownMenuItem>
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
