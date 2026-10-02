import { resolveApiOrigin } from './endpoint';
import type { IStreamHandlers } from './types';

const SSE_DONE = '[DONE]';

/**
 * Splits a raw SSE byte stream into `data:` payloads.
 * The backend emits one JSON-encoded string per chunk and no event names,
 * so the only completion signal is the stream closing.
 */
async function* readDataFrames(
  response: Response,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Frames are separated by a blank line; tolerate CRLF.
      let boundary = buffer.search(/\r?\n\r?\n/);
      while (boundary !== -1) {
        const rawFrame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary).replace(/^\r?\n\r?\n/, '');

        const payload = rawFrame
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
          .join('\n');

        if (payload) yield payload;

        boundary = buffer.search(/\r?\n\r?\n/);
      }
    }
  } finally {
    if (signal?.aborted) reader.cancel().catch(() => {});
  }
}

/**
 * POST /api/chats/{id}/messages streams the reply as Server-Sent Events.
 * `EventSource` is unusable here because it cannot issue a POST with a body,
 * so the frames are consumed straight off `fetch`.
 */
export async function streamMessageOverSSE(
  chatId: string,
  content: string,
  handlers: IStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const response = await fetch(
      `${resolveApiOrigin()}/api/chats/${encodeURIComponent(chatId)}/messages`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ content }),
        signal,
      },
    );

    if (!response.ok || !response.body) {
      const detail = await response.text().catch(() => '');
      throw new Error(detail || `Stream failed with ${response.status}`);
    }

    handlers.onOpen?.();

    for await (const payload of readDataFrames(response, signal)) {
      if (signal?.aborted) return;

      if (payload === SSE_DONE) {
        handlers.onDone();
        return;
      }

      try {
        handlers.onChunk(JSON.parse(payload) as string);
      } catch {
        // Tolerate servers that emit bare (unquoted) text chunks.
        handlers.onChunk(payload);
      }
    }

    handlers.onDone();
  } catch (error) {
    if (signal?.aborted) return;
    handlers.onError(
      error instanceof Error ? error : new Error('Stream failed'),
    );
  }
}
