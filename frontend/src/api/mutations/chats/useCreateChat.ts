import { useMutation } from '@tanstack/react-query';
import chatHandlers from '@/api/handlers/chats';

export function useCreateChat() {
  return useMutation({
    mutationFn: chatHandlers.createChat,
  });
}
