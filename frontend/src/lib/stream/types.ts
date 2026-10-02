export type TStreamTransport = 'websocket' | 'sse';

export interface IStreamHandlers {
  /** Fired once the transport is ready to accept the payload. */
  onOpen?: () => void;
  onChunk: (chunk: string) => void;
  /** Fired when the server finished the reply normally. */
  onDone: () => void;
  onError: (error: Error) => void;
}

/** Server -> client WebSocket frames, as emitted by the chat socket route. */
export interface IServerEvent<T = unknown> {
  type: string;
  data: T;
}

export const WS_EVENTS = {
  messageSend: 'chat.message.send',
  streamBegin: 'chat.stream.begin',
  streamChunk: 'chat.stream.chunk',
  streamEnd: 'chat.stream.end',
  messageCreated: 'chat.message.created',
  /** Not emitted server-side yet; wired so the client reacts as soon as it is. */
  documentUpdated: 'chat.document.updated',
} as const;
