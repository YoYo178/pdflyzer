import chatHandlers from '@/api/handlers/chats';
import { useQuery } from '@tanstack/react-query';

export function useGetChat(chatId: string) {
  return useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => chatHandlers.getChat(chatId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
