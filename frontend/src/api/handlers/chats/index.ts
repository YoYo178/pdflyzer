import { API } from '@/api/client';
import type {
  ICreateChatRequest,
  ICreateChatResponse,
  IGetChatResponse,
  IUpdateChatRequest,
  IUpdateChatResponse,
  TGetAllChatsResponse,
} from './types';

async function getAllChats() {
  const response = await API.get<TGetAllChatsResponse>('/chats/');
  return response.data;
}

async function getChat(chatId: string) {
  const response = await API.get<IGetChatResponse>(`/chats/${chatId}`);
  return response.data;
}

async function createChat(data: ICreateChatRequest) {
  const response = await API.get<ICreateChatResponse>('/chats/', data);
  return response.data;
}

async function updateChat(data: IUpdateChatRequest) {
  const response = await API.get<IUpdateChatResponse>('/chats/', data);
  return response.data;
}

async function deleteChat() {
  const response = await API.get('/chats/');
  return response.data;
}

export default { getAllChats, getChat, createChat, updateChat, deleteChat };
