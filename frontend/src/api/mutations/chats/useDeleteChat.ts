import { useMutation } from '@tanstack/react-query';
import chatHandlers from '@/api/handlers/chats';

export function useDeleteChat() {
  return useMutation({
    mutationFn: chatHandlers.deleteChat,
  });
}
