import { API } from '@/api/client';
import type { TMessage } from '@/types/message.types';
import type { ICreateMessageRequest, IUpdateMessageRequest, TGetAllMessagesResponse } from './types';

async function getAllMessages(chatId: string) {
  const response = await API.get<TGetAllMessagesResponse>(
    `/chats/${chatId}/messages`,
  );
  return response.data;
}

async function getMessage(chatId: string, messageId: string) {
  const response = await API.get<TMessage>(
    `/chats/${chatId}/messages/${messageId}`,
  );
  return response.data;
}

async function createMessage(chatId: string, data: ICreateMessageRequest) {
  const response = await API.post<TMessage>(`/chats/${chatId}/messages`, data);
  return response.data;
}

async function updateMessage(chatId: string, messageId: string, data: IUpdateMessageRequest) {
  const response = await API.patch<TMessage>(
    `/chats/${chatId}/messages/${messageId}`,
    data,
  );
  return response.data;
}

async function deleteMessage(chatId: string, messageId: string) {
  const response = await API.delete(`/chats/${chatId}/messages/${messageId}`);
  return response.data;
}

export default {
  getAllMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};
