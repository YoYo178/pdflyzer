// TODO: Add this at backend
export interface IMessageSource {
  file: string;
  page: number;
  section: string;
}

export interface IMessage {
  _id: string;

  chat_id: string;

  sender_id: string;
  sender_role: 'user' | 'assistant' | 'system';

  content: string;
  embeddings: number[]; // TODO: stop sending this from backend

  created_at: string;
  updated_at: string;

  status?: 'streaming' | 'done' | 'error'; // TODO: add in backend
  sources?: IMessageSource[]; // TODO: add in backend
  rating?: 'up' | 'down' | null; // TODO: add in backend
}
