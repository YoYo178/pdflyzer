/**
 * The chat socket lives at `/ws/chats/{id}` and is *not* namespaced under `/api`,
 * so it has to be derived from the API origin rather than the Axios baseURL.
 */
const WS_NAMESPACE = '/ws/chats';

function resolveSocketOrigin() {
  const configured = import.meta.env.VITE_API_URL;

  if (typeof configured === 'string' && configured) {
    const url = new URL(configured);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = '';
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/+$/, '');
  }

  const { protocol, host } = window.location;
  return `${protocol === 'https:' ? 'wss' : 'ws'}://${host}`;
}

export function buildChatSocketUrl(chatId: string) {
  return `${resolveSocketOrigin()}${WS_NAMESPACE}/${encodeURIComponent(chatId)}`;
}

/** Same endpoint under `fetch`, used by the SSE transport (POST, not GET). */
export function resolveApiOrigin() {
  const configured = import.meta.env.VITE_API_URL;

  if (typeof configured === 'string' && configured) {
    return new URL(configured).toString().replace(/\/+$/, '');
  }

  return window.location.origin;
}
