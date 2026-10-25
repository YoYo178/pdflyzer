import { API } from '@/api/client';
import type {
  IUpdateChatRequest,
  TCreateChatResponse,
  TDeleteChatResponse,
  TGetAllChatsResponse,
  TGetChatResponse,
  TUpdateChatResponse,
} from './types';

async function getAllChats() {
  const response = await API.get<TGetAllChatsResponse>('/chats/');
  return response.data;
}

async function getChat(chatId: string) {
  const response = await API.get<TGetChatResponse>(`/chats/${chatId}`);
  return response.data;
}

async function createChat() {
  const response = await API.post<TCreateChatResponse>('/chats/');
  return response.data;
}

async function updateChat(chatId: string, data: IUpdateChatRequest) {
  const response = await API.patch<TUpdateChatResponse>(
    `/chats/${chatId}`,
    data,
  );
  return response.data;
}

async function deleteChat(chatId: string) {
  await API.delete<TDeleteChatResponse>(`/chats/${chatId}`);
}

export default { getAllChats, getChat, createChat, updateChat, deleteChat };
