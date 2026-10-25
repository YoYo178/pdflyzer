import type { TMessage } from '@/types/message.types';

export type TGetAllMessagesResponse = TMessage[];

export type IGetMessageResponse = TMessage;

export interface ICreateMessageRequest {
  content: string;
}

export interface IUpdateMessageRequest {
  rating: 'up' | 'down' | null;
}

export type TCreateMessageResponse = TMessage;
