import { useUpdateMessage } from '@/api/mutations/messages/useUpdateMessage';
import { useGetAllMessages } from '@/api/queries/messages/useGetAllMessages';
import { useStreamMessage } from '@/api/queries/messages/useStreamMessage';
import type { IMessage } from '@/types/message.types';
import { useCallback, useEffect, useRef, useState } from 'react';

function useChatThread(activeChatId: string, seedFromServer = true) {
  const { data } = useGetAllMessages(
    activeChatId,
    seedFromServer && Boolean(activeChatId),
  );

  const stream = useStreamMessage();
  const updateMessage = useUpdateMessage();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');

  const sequence = useRef(0);
  const seededRef = useRef<string | null>(null);
  const streamingIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (seededRef.current === activeChatId) {
      if (seedFromServer && data) setMessages(data);
      return;
    }

    const previousId = seededRef.current;
    seededRef.current = activeChatId;

    if (seedFromServer) {
      setMessages(data ?? []);
      return;
    }

    // A chat created in this session has no server history yet, so re-seeding
    // would wipe the live thread. Only keep it when arriving straight from the
    // draft; coming back to it later means the thread is genuinely gone.
    if (previousId) setMessages([]);
  }, [activeChatId, data, seedFromServer]);

  const appendChunk = useCallback((id: string, chunk: string) => {
    setMessages((current) =>
      current.map((message) =>
        message._id === id
          ? { ...message, content: message.content + chunk }
          : message,
      ),
    );
  }, []);

  const runStream = useCallback(
    async (chatId: string, prompt: string) => {
      const id = `stream-${++sequence.current}`;
      streamingIdRef.current = id;

      setMessages((current) => [
        ...current,
        {
          _id: id,
          chat_id: chatId,
          sender_id: '',
          sender_role: 'assistant',
          content: '',
          embeddings: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'streaming',
          rating: null,
        },
      ]);
      setIsStreaming(true);
      setStatusLabel('Thinking');

      await stream.send(chatId, prompt, (chunk) => appendChunk(id, chunk));

      setMessages((current) =>
        current.map((message) =>
          message._id === id ? { ...message, status: 'done' } : message,
        ),
      );
      setIsStreaming(false);
      setStatusLabel('');
      streamingIdRef.current = null;
    },
    [appendChunk, stream],
  );

  const send = useCallback(
    async (prompt: string, chatId?: string) => {
      const text = prompt.trim();
      if (!text || !chatId) return;

      setMessages((current) => [
        ...current,
        {
          _id: `user-${++sequence.current}`,
          chat_id: chatId,
          sender_id: '',
          sender_role: 'user',
          content: text,
          embeddings: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'done',
          rating: null,
        },
      ]);

      await runStream(chatId, text);
    },
    [runStream],
  );

  const stop = useCallback(() => {
    stream.abort();

    if (streamingIdRef.current) {
      const id = streamingIdRef.current;
      streamingIdRef.current = null;

      setMessages((current) =>
        current.map((message) =>
          message._id === id ? { ...message, status: 'done' } : message,
        ),
      );
    }

    setIsStreaming(false);
    setStatusLabel('');
  }, [stream]);

  const regenerate = useCallback(async () => {
    const lastUser = [...messages]
      .reverse()
      .find((message) => message.sender_role === 'user');
    if (!lastUser || !lastUser.chat_id) return;

    stop();

    setMessages((current) => {
      const trimmed = [...current];
      while (
        trimmed.length > 0 &&
        trimmed[trimmed.length - 1].sender_role === 'assistant'
      ) {
        trimmed.pop();
      }
      return trimmed;
    });

    await runStream(lastUser.chat_id, lastUser.content);
  }, [messages, runStream, stop]);

  const rate = useCallback(
    async (id: string, value: 'up' | 'down' | null) => {
      setMessages((current) =>
        current.map((message) =>
          message._id === id ? { ...message, rating: value } : message,
        ),
      );
      await updateMessage.mutateAsync({
        chatId: activeChatId,
        messageId: id,
        rating: value,
      });
    },
    [activeChatId, updateMessage],
  );

  return {
    messages,
    isStreaming,
    statusLabel,
    transport: stream.transport,
    send,
    stop,
    regenerate,
    rate,
  };
}

export default useChatThread;
