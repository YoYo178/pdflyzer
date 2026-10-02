import type { IMessage } from '@/types/message.types';

export type TGetAllMessagesResponse = IMessage[];

export type IGetMessageResponse = IMessage;

export interface ICreateMessageRequest {
  content: string;
}

export type TCreateMessageResponse = IMessage;
