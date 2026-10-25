import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getChatSocket, isSocketAvailable } from '@/lib/stream/socket';
import { WS_EVENTS } from '@/lib/stream/types';

interface IRealtimeState {
  chatId: string;
  active: boolean;
}

/**
 * Push updates for document indexing state.
 *
 * The chat socket is shared with message streaming, so this only asks for an
 * invalidation when the server actually pushes `chat.document.updated`. The
 * backend does not emit that frame yet, so realtime stays false and the query
 * keeps its HTTP polling fallback until it does.
 */
export function useDocumentLiveUpdates(chatId?: string, enabled = true) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<IRealtimeState | null>(null);

  useEffect(() => {
    if (!chatId || !enabled) return;

    let cancelled = false;
    const unsubscribe = getChatSocket(chatId).subscribe((event) => {
      if (event.type !== WS_EVENTS.documentUpdated) return;

      queryClient.invalidateQueries({
        queryKey: ['chats', chatId, 'documents'],
      });
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

export default useDocumentLiveUpdates;