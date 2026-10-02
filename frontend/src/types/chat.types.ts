export type TMessageStatus = 'streaming' | 'done' | 'error';

export type TDocumentStatus = 'queued' | 'processing' | 'ready' | 'failed';

export interface IDocument {
  id: string;
  name: string;
  size: number;
  pages: number;
  status: TDocumentStatus;
}

export interface IUserProfile {
  name: string;
  email: string;
  initials: string;
}

// TODO: Mock types above!!

// TODO: change AI response to be 'assistant' at backend so 'system' can be reserved for platform related news/announcements/alerts
export type TMessageRole = 'user' | 'assistant' | 'system';

export type TStreamTransport = 'websocket' | 'sse';

export interface IChat {
  _id: string;
  name: string;
  owner_id: string;
  updated_at: string;
  pinned?: boolean; // TODO: add in backend
}

// TODO: add in backend
export interface ISource {
  file: string;
  page: number;
  section: string;
}

export interface IChatMessage {
  _id: string;

  chat_id: string;

  sender_id: string;
  sender_role: TMessageRole;

  content: string;
  embeddings: number[]; // TODO: stop sending this from backend

  created_at: string;
  updated_at: string;

  status?: TMessageStatus; // TODO: add in backend
  sources?: ISource[]; // TODO: add in backend
  rating?: 'up' | 'down' | null; // TODO: add in backend
}