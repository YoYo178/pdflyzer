import type { IChat } from '@/types/chat.types';

export type TGetAllChatsResponse = IChat[];

export type TGetChatResponse = IChat;

export type TCreateChatResponse = IChat;

export interface IUpdateChatRequest {
  name: string;
};
export type TUpdateChatResponse = IChat;

export type TDeleteChatResponse = void;
