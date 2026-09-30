export type TMessageRole = 'user' | 'assistant';

export type TMessageStatus = 'streaming' | 'done' | 'error';

export type TDocumentStatus = 'ready' | 'processing' | 'error';

export type TChatMode = 'ask' | 'dive';

export interface IDocument {
  id: string;
  name: string;
  pages: number;
  size: string;
  status: TDocumentStatus;
  progress?: number;
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

export interface IChat {
  id: string;
  title: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface IUserProfile {
  name: string;
  email: string;
  initials: string;
}