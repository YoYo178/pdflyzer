import { API } from '@/api/client';
import type { IDocument } from '@/types/document.types';

async function getAllDocuments(chatId: string) {
  const response = await API.get<IDocument[]>(`/chats/${chatId}/documents`);
  return response.data;
}

async function uploadDocuments(chatId: string, files: File[]) {
  const body = new FormData();
  files.forEach((file) => body.append('files', file));

  await API.post(`/chats/${chatId}/documents`, body);
}

async function deleteDocument(chatId: string, documentId: string) {
  await API.delete(`/chats/${chatId}/documents/${documentId}`);
}

export default { getAllDocuments, uploadDocuments, deleteDocument };
