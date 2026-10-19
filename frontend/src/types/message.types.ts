export interface IMessageSource {
  stored_document: string;

  page_start: number;
  page_end: number;

  paragraph_start: number;
  paragraph_end: number;

  section: string;
}

export interface IMessage {
  id: string;

  chat: string;

  sender: string;
  sender_role: 'user' | 'assistant' | 'system';

  content: string;

  rating: 'up' | 'down' | null;

  status: 'streaming' | 'done' | 'error';
  sources?: IMessageSource[];

  created_at: string;
  updated_at: string;
}
