export type TMessageStatus = 'streaming' | 'done' | 'error';

export type TDocumentStatus = 'queued' | 'processing' | 'ready' | 'failed';

export interface IDocument {
  id: string;
  name: string;
  size: number;
  pages: number;
  status: TDocumentStatus;
}

export interface ISource {
  file: string;
  page: number;
  section: string;
}

export interface IChatMessage {
  id: string;
  role: TMessageRole;
  content: string;
  createdAt: string;
  status?: TMessageStatus;
  sources?: ISource[];
  rating?: 'up' | 'down' | null;
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