import { useCallback, useEffect, useRef, useState } from 'react';

import { CANNED_REPLIES, FALLBACK_REPLY } from './mock-chat';
import type { IChatMessage, ISource, TChatMode } from '@/types/chat.types';

const CHUNK_MS = 26;
const FIRST_TOKEN_MS = 420;

interface ICannedReply {
  status: string[];
  sources: ISource[];
  ask: string;
  dive: string;
  text: string;
}

function resolveReply(prompt: string, mode: TChatMode): ICannedReply {
  const match = CANNED_REPLIES.find((reply) => reply.match.test(prompt)) ?? FALLBACK_REPLY;
  return { ...match, text: mode === 'dive' ? match.dive : match.ask };
}

function useChatThread(initial: IChatMessage[]) {
  const [messages, setMessages] = useState<IChatMessage[]>(initial);
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');
  const timers = useRef<number[]>([]);
  const sequence = useRef(0);
  const lastMode = useRef<TChatMode>('ask');

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const stream = useCallback(
    (prompt: string, mode: TChatMode) => {
      clearTimers();

      const reply = resolveReply(prompt, mode);
      const id = `stream-${++sequence.current}`;

      setMessages((current) => [
        ...current,
        {
          id,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
          status: 'streaming',
        },
      ]);
      setIsStreaming(true);
      setStatusLabel(reply.status[0]);

      reply.status.slice(1).forEach((label, index) => {
        timers.current.push(
          window.setTimeout(() => setStatusLabel(label), 900 + index * 1100),
        );
      });

      const tokens = reply.text.split(' ');

      tokens.forEach((token, index) => {
        timers.current.push(
          window.setTimeout(() => {
            setMessages((current) =>
              current.map((message) =>
                message.id === id
                  ? { ...message, content: message.content ? `${message.content} ${token}` : token }
                  : message,
              ),
            );
          }, FIRST_TOKEN_MS + index * CHUNK_MS),
        );
      });

      timers.current.push(
        window.setTimeout(() => {
          setMessages((current) =>
            current.map((message) =>
              message.id === id
                ? { ...message, status: 'done', sources: reply.sources }
                : message,
            ),
          );
          setIsStreaming(false);
          setStatusLabel('');
        }, FIRST_TOKEN_MS + tokens.length * CHUNK_MS + 240),
      );
    },
    [clearTimers],
  );

  const send = useCallback(
    (prompt: string, mode: TChatMode) => {
      const text = prompt.trim();
      if (!text) return;

      lastMode.current = mode;

      setMessages((current) => [
        ...current,
        {
          id: `user-${++sequence.current}`,
          role: 'user',
          content: text,
          createdAt: new Date().toISOString(),
          status: 'done',
        },
      ]);
      stream(text, mode);
    },
    [stream],
  );

  const stop = useCallback(() => {
    clearTimers();
    setMessages((current) =>
      current.map((message, index) =>
        index === current.length - 1 && message.status === 'streaming'
          ? { ...message, status: 'done' }
          : message,
      ),
    );
    setIsStreaming(false);
    setStatusLabel('');
  }, [clearTimers]);

  const regenerate = useCallback(() => {
    const lastUser = [...messages].reverse().find((message) => message.role === 'user');
    if (!lastUser) return;

    setMessages((current) => {
      const trimmed = [...current];
      while (trimmed.length > 0 && trimmed[trimmed.length - 1].role === 'assistant') {
        trimmed.pop();
      }
      return trimmed;
    });
    stream(lastUser.content, lastMode.current);
  }, [messages, stream]);

  const rate = useCallback((id: string, rating: 'up' | 'down' | null) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, rating } : message)),
    );
  }, []);

  const load = useCallback(
    (thread: IChatMessage[]) => {
      clearTimers();
      setMessages(thread);
      setIsStreaming(false);
      setStatusLabel('');
    },
    [clearTimers],
  );

  return { messages, isStreaming, statusLabel, send, stop, regenerate, rate, load };
}

export default useChatThread;