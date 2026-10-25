import { useMutation, useQueryClient } from '@tanstack/react-query';

import messageHandlers from '@/api/handlers/messages';
import type { IUpdateMessageRequest } from '@/api/handlers/messages/types';

interface IUpdateMessageVariables extends IUpdateMessageRequest {
  chatId: string;
  messageId: string;
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, messageId, ...data }: IUpdateMessageVariables) =>
      messageHandlers.updateMessage(chatId, messageId, data),
    onSuccess: (_data, { chatId, messageId }) => {
      queryClient.invalidateQueries({
        queryKey: ['chats', chatId, 'messages'],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['chats', chatId, 'messages', messageId],
        exact: true,
      });
    },
  });
}
