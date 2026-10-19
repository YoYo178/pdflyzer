export interface IMessageSource {
  stored_document: string;

  page_start: number;
  page_end: number;

  paragraph_start: number;
  paragraph_end: number;

  section: string;
}

interface IBaseMessage {
  id: string;

  chat: string;
  content: string;

  created_at: string;
  updated_at: string;
}

interface ISystemMessage extends IBaseMessage {
  sender: null;
  sender_role: 'system';

  rating: null;

  status: null;
  sources: null;
}

interface IAssistantMessage extends IBaseMessage {
  sender: null;
  sender_role: 'assistant';

  rating: 'up' | 'down' | null;

  status: 'streaming' | 'done' | 'error';
  sources: IMessageSource[];
}

interface IUserMessage extends IBaseMessage {
  sender: string;
  sender_role: 'user';

  rating: null;

  status: null;
  sources: [];
}

export type TMessage = IAssistantMessage | IUserMessage | ISystemMessage