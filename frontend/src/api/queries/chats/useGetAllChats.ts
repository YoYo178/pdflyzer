import chatHandlers from '@/api/handlers/chats';
import { useQuery } from '@tanstack/react-query';

export function useGetAllChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: chatHandlers.getAllChats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
