import type { IChat } from '@/types/chat.types';

export type TGetAllChatsResponse = IChat[];

export type TGetChatResponse = IChat;

export type TCreateChatResponse = IChat;

/** PATCH is partial: send only the fields being changed. */
export interface IUpdateChatRequest {
  name?: string;
  pinned?: boolean;
}
export type TUpdateChatResponse = IChat;

export type TDeleteChatResponse = void;
