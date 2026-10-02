import { useQuery } from '@tanstack/react-query';

import messageHandlers from '@/api/handlers/messages';

export function useGetAllMessages(chatId: string, enabled = true) {
  return useQuery({
    queryKey: ['chats', chatId, 'messages'],
    queryFn: () => messageHandlers.getAllMessages(chatId),
    enabled: Boolean(chatId) && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}