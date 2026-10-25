import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getChatSocket } from '@/lib/stream/socket';
import { WS_EVENTS } from '@/lib/stream/types';
import { toast } from 'sonner';

const errorEvents = new Set<(typeof WS_EVENTS)[keyof typeof WS_EVENTS]>([
  WS_EVENTS.chatTitleError,
  WS_EVENTS.streamError,
]);

export const useSocketErrorHandling = (chatId?: string, enabled = true) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId || !enabled) return;

    const unsubscribe = getChatSocket(chatId).subscribe((event) => {
      if (!errorEvents.has(event.type)) return;

      const title =
        event.type === 'chat.title.error'
          ? 'Error generating chat title!'
          : 'Error streaming AI response!';

      const error =
        (event.data as string) ||
        'Something went wrong on the server, please try again later.';

      toast.error(title, { description: error });
    });

    return () => {
      unsubscribe();
    };
  }, [chatId, enabled, queryClient]);
};
