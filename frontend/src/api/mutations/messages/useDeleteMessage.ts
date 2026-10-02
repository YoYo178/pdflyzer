import { useMutation } from '@tanstack/react-query';
import messageHandlers from '@/api/handlers/messages';

export function useDeleteMessage(chatId: string, messageId: string) {
  return useMutation({
    mutationFn: () => messageHandlers.deleteMessage(chatId, messageId),
  });
}
