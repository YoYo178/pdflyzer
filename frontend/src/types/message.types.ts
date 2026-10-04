// TODO: Add at backend
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

  created_at: string;
  updated_at: string;

  status?: 'streaming' | 'done' | 'error'; // TODO: Add at backend
  sources?: IMessageSource[]; // TODO: Add at backend
  rating?: 'up' | 'down' | null; // TODO: Add at backend
}
