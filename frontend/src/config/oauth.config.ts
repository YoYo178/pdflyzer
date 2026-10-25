import type { TOAuthProvider } from '@/api/handlers/auth/types';
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from '@tabler/icons-react';
import type { ComponentType } from 'react';

export interface IProviderOption {
  id: TOAuthProvider;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

export const PROVIDERS: readonly IProviderOption[] = [
  { id: 'google', label: 'Google', Icon: IconBrandGoogleFilled },
  { id: 'github', label: 'GitHub', Icon: IconBrandGithubFilled },
];

export const isOAuthEnabled = import.meta.env.VITE_OAUTH_ENABLED === 'true';
