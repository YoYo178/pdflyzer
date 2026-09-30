import {
  IconChevronDown,
  IconKeyboard,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { MOCK_USER } from './mock-chat';
import { cn } from '@/lib/utils';

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
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = resolvedTheme === 'dark';

  return (
    <DropdownMenu
      className={className}
      menuClassName="w-60"
      triggerClassName={cn(
        'flex items-center gap-2 rounded-full border border-border bg-secondary/40 p-1 transition-colors hover:border-teal-600/40 hover:bg-secondary dark:hover:border-teal-300/40 sm:py-1 sm:pl-1 sm:pr-2.5',
        triggerClassName,
      )}
      trigger={
        <>
          <Avatar className="h-6 w-6 text-[9px]" />
          <span className="hidden text-xs font-medium text-foreground sm:block">
            {MOCK_USER.name}
          </span>
          <IconChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-lg px-2.5 py-2">
        <Avatar />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {MOCK_USER.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{MOCK_USER.email}</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        icon={<IconSettings />}
        onClick={() => navigate('/settings')}
      >
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem icon={<IconKeyboard />}>Keyboard shortcuts</DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        icon={isDark ? <IconSun /> : <IconMoon />}
      >
        {isDark ? 'Light mode' : 'Dark mode'}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        icon={<IconLogout />}
        onClick={() => navigate('/login')}
      >
        Sign out
      </DropdownMenuItem>
    </DropdownMenu>
  );
}

export default UserMenu;