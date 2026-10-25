import { useMutation, useQueryClient } from '@tanstack/react-query';

import chatHandlers from '@/api/handlers/chats';

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatHandlers.deleteChat,
    onSuccess: (_data, chatId) => {
      queryClient.removeQueries({ queryKey: ['chats', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'], exact: true });
    },
  });
}