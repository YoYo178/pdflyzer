import { useMutation } from '@tanstack/react-query';

import { streamMessageOverSSE } from '@/lib/stream/sse';

export interface ISSEStreamRequest {
  chatId: string;
  content: string;
  onChunk?: (chunk: string, chunkType: 'MESSAGE_CHUNK' | 'SOURCES_CHUNK') => void;
  signal?: AbortSignal;
}

/**
 * SSE fallback transport. The backend only accepts POST for a streamed reply,
 * so this wraps a `fetch` reader rather than `EventSource`, and is exposed as a
 * react-query mutation to keep parity with the websocket path.
 */
export function useSSEStream() {
  return useMutation<void, Error, ISSEStreamRequest>({
    mutationKey: ['chats', 'sse-stream'],
    mutationFn: ({ chatId, content, onChunk, signal }) =>
      new Promise<void>((resolve, reject) => {
        streamMessageOverSSE(
          chatId,
          content,
          {
            onChunk: (chunk, chunkType) => onChunk?.(chunk, chunkType),
            onDone: () => resolve(),
            onError: (error) => reject(error),
          },
          signal,
        );
      }),
  });
}

export default useSSEStream;