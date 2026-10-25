import { useMutation, useQueryClient } from '@tanstack/react-query';

import chatHandlers from '@/api/handlers/chats';
import type { IUpdateChatRequest } from '@/api/handlers/chats/types';

interface IUpdateChatVariables extends IUpdateChatRequest {
  chatId: string;
}

export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, ...data }: IUpdateChatVariables) =>
      chatHandlers.updateChat(chatId, data),
    onSuccess: (_data, { chatId }) => {
      queryClient.invalidateQueries({
        queryKey: ['chats'],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ['chats', chatId], exact: true });
    },
  });
}