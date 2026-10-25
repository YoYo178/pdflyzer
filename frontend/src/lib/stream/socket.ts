import { buildChatSocketUrl } from './endpoint';
import { WS_EVENTS, type IServerEvent } from './types';

const CONNECT_TIMEOUT_MS = 2_500;
const MAX_RECONNECT_DELAY_MS = 15_000;

type TEventListener = (event: IServerEvent) => void;

interface IChatSocket {
  /** Opens the socket, rejecting if it cannot connect within the timeout. */
  open: () => Promise<void>;
  /** Sends once the socket is open; rejects immediately if it is not. */
  send: (type: string, data?: unknown) => void;
  subscribe: (listener: TEventListener) => () => void;
  close: () => void;
  readonly isOpen: boolean;
}

const registry = new Map<string, IChatSocket>();

function createChatSocket(chatId: string): IChatSocket {
  const listeners = new Set<TEventListener>();
  let socket: WebSocket | null = null;
  let connectTimer: number | undefined;
  let reconnectTimer: number | undefined;
  let attempts = 0;
  let closedByCaller = false;
  let opening: Promise<void> | null = null;

  function clearTimers() {
    if (connectTimer) window.clearTimeout(connectTimer);
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    connectTimer = undefined;
    reconnectTimer = undefined;
  }

  function emit(event: IServerEvent) {
    listeners.forEach((listener) => listener(event));
  }

  function handleFrame(raw: unknown) {
    if (typeof raw !== 'string') return;

    let parsed: IServerEvent;
    try {
      parsed = JSON.parse(raw) as IServerEvent;
    } catch {
      return;
    }

    if (parsed && typeof parsed.type === 'string') emit(parsed);
  }

  function teardown() {
    clearTimers();
    opening = null;

    const current = socket;
    socket = null;
    if (!current) return;

    current.onopen = null;
    current.onmessage = null;
    current.onerror = null;
    current.onclose = null;

    if (
      current.readyState === WebSocket.OPEN ||
      current.readyState === WebSocket.CONNECTING
    ) {
      current.close();
    }
  }

  function scheduleReconnect() {
    if (closedByCaller || reconnectTimer) return;

    const delay = Math.min(1_000 * 2 ** attempts, MAX_RECONNECT_DELAY_MS);
    attempts += 1;

    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = undefined;
      void open().catch(() => {
        /* scheduleReconnect retries on the next failure */
      });
    }, delay);
  }

  function open(): Promise<void> {
    if (socket?.readyState === WebSocket.OPEN) return Promise.resolve();
    if (opening) return opening;

    closedByCaller = false;
    clearTimers();

    opening = new Promise<void>((resolve, reject) => {
      let settled = false;

      const fail = (error: Error) => {
        if (settled) return;
        settled = true;
        opening = null;
        teardown();
        reject(error);
      };

      const succeed = () => {
        if (settled) return;
        settled = true;
        if (connectTimer) window.clearTimeout(connectTimer);
        connectTimer = undefined;
        attempts = 0;
        resolve();
      };

      let next: WebSocket;
      try {
        next = new WebSocket(buildChatSocketUrl(chatId));
      } catch (cause) {
        fail(
          new Error(cause instanceof Error ? cause.message : 'Socket error'),
        );
        return;
      }

      socket = next;

      connectTimer = window.setTimeout(
        () => fail(new Error('Socket connect timed out')),
        CONNECT_TIMEOUT_MS,
      );

      next.onopen = succeed;

      next.onmessage = (message: MessageEvent) => handleFrame(message.data);

      next.onerror = () => fail(new Error('Socket connection failed'));

      next.onclose = (event: CloseEvent) => {
        const wasOpening = !settled;

        if (wasOpening) {
          fail(
            new Error(
              event.code === 1011
                ? 'Server rejected the stream'
                : 'Socket closed before it opened',
            ),
          );
          return;
        }

        teardown();
        emit({ type: WS_EVENTS.socketClosed, data: null });
        scheduleReconnect();
      };
    });

    return opening;
  }

  return {
    open,
    send(type, data) {
      if (socket?.readyState !== WebSocket.OPEN) {
        throw new Error('Socket is not open');
      }
      socket.send(JSON.stringify({ type, data }));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    close() {
      closedByCaller = true;
      clearTimers();
      teardown();
    },
    get isOpen() {
      return socket?.readyState === WebSocket.OPEN;
    },
  };
}

/** Shared per chat so message streaming and document updates reuse one socket. */
export function getChatSocket(chatId: string) {
  const existing = registry.get(chatId);
  if (existing) return existing;

  const created = createChatSocket(chatId);
  registry.set(chatId, created);
  return created;
}

/** Resolves true when the chat socket is reachable; falls through on failure. */
export async function isSocketAvailable(chatId: string) {
  try {
    await getChatSocket(chatId).open();
    return true;
  } catch {
    return false;
  }
}

export { WS_EVENTS };
