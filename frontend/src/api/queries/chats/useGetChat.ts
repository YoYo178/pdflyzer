import { useQuery } from '@tanstack/react-query';

import chatHandlers from '@/api/handlers/chats';

export function useGetChat(chatId?: string) {
  return useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => chatHandlers.getChat(chatId as string),
    enabled: Boolean(chatId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}