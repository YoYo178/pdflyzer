import { useMutation, useQueryClient } from '@tanstack/react-query';

import chatHandlers from '@/api/handlers/chats';

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatHandlers.createChat,
    onSuccess: (chat) => {
      queryClient.setQueryData(['chats'], (current: unknown) =>
        Array.isArray(current) ? [chat, ...current] : [chat],
      );
    },
  });
}