import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getChatSocket, isSocketAvailable } from '@/lib/stream/socket';
import { WS_EVENTS, type TStreamTransport } from '@/lib/stream/types';
import { useSSEStream } from './useSSEStream';

export const POLLING_FALLBACK_MS = 4_000;

/**
 * Sends a message over the best transport the environment supports.
 * Preference order: WebSocket stream -> SSE stream -> message polling.
 */
export function useStreamMessage() {
  const queryClient = useQueryClient();
  const sseStream = useSSEStream();

  const [transport, setTransport] = useState<TStreamTransport>('websocket');

  const abortRef = useRef<AbortController | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pollerRef = useRef<number | undefined>(undefined);

  const invalidate = useCallback(
    (chatId: string) => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'messages'] });
    },
    [queryClient],
  );

  const clearPolling = useCallback(() => {
    if (pollerRef.current) window.clearInterval(pollerRef.current);
    pollerRef.current = undefined;
  }, []);

  /** Last resort: let the server finish its turn and pick the reply up by refetch. */
  const startPolling = useCallback(
    (chatId: string) => {
      clearPolling();
      pollerRef.current = window.setInterval(() => invalidate(chatId), POLLING_FALLBACK_MS);
    },
    [clearPolling, invalidate],
  );

  useEffect(
    () => () => {
      abortRef.current?.abort();
      unsubscribeRef.current?.();
      clearPolling();
    },
    [clearPolling],
  );

  /** Resolves false when the socket cannot carry the reply so SSE can take over. */
  const streamOverSocket = useCallback(
    (chatId: string, content: string, onChunk: (chunk: string) => void) =>
      new Promise<boolean>((resolve) => {
        const socket = getChatSocket(chatId);

        const finish = (ok: boolean) => {
          unsubscribeRef.current?.();
          unsubscribeRef.current = null;
          resolve(ok);
        };

        unsubscribeRef.current = socket.subscribe((event) => {
          if (event.type === WS_EVENTS.streamChunk) {
            onChunk(String(event.data ?? ''));
          } else if (event.type === WS_EVENTS.streamEnd) {
            finish(true);
          }
        });

        socket.open().then(
          () => {
            try {
              socket.send(WS_EVENTS.messageSend, content);
            } catch {
              finish(false);
            }
          },
          () => finish(false),
        );
      }),
    [],
  );

  const send = useCallback(
    async (chatId: string, content: string, onChunk: (chunk: string) => void) => {
      clearPolling();
      abortRef.current?.abort();

      if (await isSocketAvailable(chatId)) {
        setTransport('websocket');

        if (await streamOverSocket(chatId, content, onChunk)) {
          invalidate(chatId);
          return;
        }
      }

      // Socket unreachable or dropped mid-flight: fall back to SSE streaming.
      setTransport('sse');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await sseStream.mutateAsync({ chatId, content, onChunk, signal: controller.signal });
        invalidate(chatId);
      } catch {
        // Both live transports failed. The server persists the user turn
        // *before* streaming the reply, so re-POSTing here would duplicate the
        // message on any mid-stream drop. Poll instead: the reply either lands
        // on its own or the user resends, and the optimistic bubble stays put.
        startPolling(chatId);
      }
    },
    [
      clearPolling,
      invalidate,
      sseStream,
      startPolling,
      streamOverSocket,
    ],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    clearPolling();
  }, [clearPolling]);

  return { send, abort, transport };
}

export default useStreamMessage;