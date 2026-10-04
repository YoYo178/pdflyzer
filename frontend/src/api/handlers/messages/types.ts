import type { IMessage } from '@/types/message.types';

export type TGetAllMessagesResponse = IMessage[];

export type IGetMessageResponse = IMessage;

export interface ICreateMessageRequest {
  content: string;
}

export interface IUpdateMessageRequest {
  rating: 'up' | 'down' | null;
}

export type TCreateMessageResponse = IMessage;
