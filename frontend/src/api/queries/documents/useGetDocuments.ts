import { useQuery } from '@tanstack/react-query';

import documentHandlers from '@/api/handlers/documents';

const PROCESSING_POLL_MS = 3_000;

export function useGetDocuments(chatId?: string) {
  return useQuery({
    queryKey: ['chats', chatId, 'documents'],
    queryFn: () => documentHandlers.getAllDocuments(chatId as string),
    enabled: Boolean(chatId),
    staleTime: 30 * 1000, // 30 seconds
    retry: false,
    refetchInterval: ({ state }) =>
      state.data?.some(
        (document) =>
          document.status === 'QUEUED' || document.status === 'PROCESSING',
      )
        ? PROCESSING_POLL_MS
        : false,
  });
}