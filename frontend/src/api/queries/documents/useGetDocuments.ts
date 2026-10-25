import { useQuery } from '@tanstack/react-query';

import documentHandlers from '@/api/handlers/documents';

const PROCESSING_POLL_MS = 3_000;

export function useGetDocuments(chatId?: string, shouldPoll: boolean = true) {
  return useQuery({
    queryKey: ['chats', chatId, 'documents'],
    queryFn: () => documentHandlers.getAllDocuments(chatId as string),
    enabled: Boolean(chatId),
    staleTime: 30 * 1000, // 30 seconds
    retry: false,
    refetchInterval: ({ state }) =>
      shouldPoll &&
      state.data?.some(
        (document) =>
          document.stored_document.status === 'QUEUED' || document.stored_document.status === 'PROCESSING',
      )
        ? PROCESSING_POLL_MS
        : false,
  });
}
