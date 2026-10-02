import { API } from '@/api/client';

import type { TOAuthMode, TOAuthProvider } from './types';

export const isOAuthEnabled = import.meta.env.VITE_OAUTH_ENABLED === 'true';

function oauthAuthorizeUrl(provider: TOAuthProvider, mode: TOAuthMode) {
  const url = new URL(
    `/auth/oauth/${provider}/authorize`,
    API.defaults.baseURL,
  );

  url.searchParams.set('mode', mode);
  url.searchParams.set('redirect_uri', `${window.location.origin}/dashboard`);

  return url.toString();
}

// TODO: Implement OAuth2 flow at the backend
export function startOAuth(provider: TOAuthProvider, mode: TOAuthMode) {
  window.location.assign(oauthAuthorizeUrl(provider, mode));
}
