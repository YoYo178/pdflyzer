import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getChatSocket, isSocketAvailable } from '@/lib/stream/socket';
import { WS_EVENTS } from '@/lib/stream/types';
import type { IChat } from '@/types/chat.types';

interface IRealtimeState {
  chatId: string;
  active: boolean;
}

export function useChatLiveUpdates(chatId?: string, enabled = true) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<IRealtimeState | null>(null);

  useEffect(() => {
    if (!chatId || !enabled) return;

    let cancelled = false;
    const unsubscribe = getChatSocket(chatId).subscribe((event) => {
      if (event.type !== WS_EVENTS.chatTitleUpdated) return;

      const oldChatsData = queryClient.getQueryData(['chats']) as IChat[];

      const newChatsData = oldChatsData.map((c) =>
        c._id === chatId ? { ...c, name: event.data } : c,
      );

      queryClient.setQueryData(['chats'], newChatsData);
    });

    void isSocketAvailable(chatId).then((available) => {
      if (cancelled) return;
      setState({ chatId, active: available });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [chatId, enabled, queryClient]);

  // Derived so switching chats cannot report a stale connection.
  return (
    Boolean(chatId) &&
    enabled &&
    state?.chatId === chatId &&
    state?.active === true
  );
}

export default useChatLiveUpdates;
