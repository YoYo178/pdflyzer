import { useMutation } from '@tanstack/react-query';
import chatHandlers from '@/api/handlers/chats';

export function useUpdateChat() {
  return useMutation({
    mutationFn: chatHandlers.updateChat,
  });
}
