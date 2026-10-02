import messageHandlers from '@/api/handlers/messages';
import { useQuery } from '@tanstack/react-query';

export function useGetAllMessages(chatId: string) {
  return useQuery({
    queryKey: ['chats', chatId, 'messages'],
    queryFn: () => messageHandlers.getAllMessages(chatId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
