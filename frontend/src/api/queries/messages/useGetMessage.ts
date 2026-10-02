import messageHandlers from '@/api/handlers/messages';
import { useQuery } from '@tanstack/react-query';

export function useGetMessage(chatId: string, messageId: string) {
  return useQuery({
    queryKey: ['chats', chatId, 'messages', messageId],
    queryFn: () => messageHandlers.getMessage(chatId, messageId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
