export type TStreamTransport = 'websocket' | 'sse';

export interface IStreamHandlers {
  /** Fired once the transport is ready to accept the payload. */
  onOpen?: () => void;
  onChunk: (chunk: string) => void;
  /** Fired when the server finished the reply normally. */
  onDone: () => void;
  onError: (error: Error) => void;
}

export const WS_EVENTS = {
  socketClosed: 'socket.closed',

  messageSend: 'chat.message.send',

  streamBegin: 'chat.stream.begin',
  streamChunk: 'chat.stream.chunk',
  streamSourcesChunk: 'chat.stream.sources_chunk',
  streamEnd: 'chat.stream.end',

  /** Not emitted server-side yet; wired so the client reacts as soon as it is. */
  documentUpdated: 'chat.document.update',

  chatTitleUpdated: 'chat.title.update',
} as const;

/** Server -> client WebSocket frames, as emitted by the chat socket route. */
export interface IServerEvent<T = unknown> {
  type: (typeof WS_EVENTS)[keyof typeof WS_EVENTS];
  data: T;
}
