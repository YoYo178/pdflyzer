import { useMutation, useQueryClient } from '@tanstack/react-query';

import documentHandlers from '@/api/handlers/documents';
import type { IUploadDocumentsRequest } from '@/api/handlers/documents/types';

export function useUploadDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, files }: IUploadDocumentsRequest) =>
      documentHandlers.uploadDocuments(chatId, files),
    onSuccess: (_data, { chatId }) => {
      queryClient.invalidateQueries({
        queryKey: ['chats', chatId, 'documents'],
      });
    },
  });
}