import { useMutation, useQueryClient } from '@tanstack/react-query';

import documentHandlers from '@/api/handlers/documents';
import type { IDeleteDocumentRequest } from '@/api/handlers/documents/types';

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, documentId }: IDeleteDocumentRequest) =>
      documentHandlers.deleteDocument(chatId, documentId),
    onSuccess: (_data, { chatId }) => {
      queryClient.invalidateQueries({
        queryKey: ['chats', chatId, 'documents'],
      });
    },
  });
}