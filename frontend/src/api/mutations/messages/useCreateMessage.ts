import { useMutation } from '@tanstack/react-query';
import messageHandlers from '@/api/handlers/messages';

export function useCreateMessage() {
  return useMutation({
    mutationFn: messageHandlers.createMessage,
  });
}
