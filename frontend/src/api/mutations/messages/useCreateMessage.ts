import { useMutation, useQueryClient } from '@tanstack/react-query';

import messageHandlers from '@/api/handlers/messages';

interface ICreateMessageVariables {
  chatId: string;
  content: string;
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, content }: ICreateMessageVariables) =>
      messageHandlers.createMessage(chatId, { content }),
    onSuccess: (_data, { chatId }) => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'messages'] });
    },
  });
}