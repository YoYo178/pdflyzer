import { API } from '@/api/client';
import type { IMessage } from '@/types/message.types';
import type { TGetAllMessagesResponse } from './types';

async function getAllMessages(chatId: string) {
  const response = await API.get<TGetAllMessagesResponse>(
    `/chats/${chatId}/messages`,
  );
  return response.data;
}

async function getMessage(chatId: string, messageId: string) {
  const response = await API.get<IMessage>(
    `/chats/${chatId}/messages/${messageId}`,
  );
  return response.data;
}

async function createMessage(chatId: string, data: unknown) {
  const response = await API.post<IMessage>(`/chats/${chatId}/messages`, data);
  return response.data;
}

async function deleteMessage(chatId: string, messageId: string) {
  const response = await API.delete(`/chats/${chatId}/messages/${messageId}`);
  return response.data;
}

export default { getAllMessages, getMessage, createMessage, deleteMessage };
