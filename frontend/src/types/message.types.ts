export interface IMessageSource {
  filename: string;

  page_start: number;
  page_end: number;

  paragraph_start: number;
  paragraph_end: number;

  section: string;
}

export interface IMessage {
  id: string;

  chat_id: string;

  sender_id: string;
  sender_role: 'user' | 'assistant' | 'system';

  content: string;

  created_at: string;
  updated_at: string;

  rating: 'up' | 'down' | null;

  status?: 'streaming' | 'done' | 'error'; // TODO: Add at backend
  sources?: IMessageSource[];
}
