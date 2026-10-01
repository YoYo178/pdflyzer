import { useMutation } from '@tanstack/react-query';
import userHandlers from '@/api/handlers/users';

export function useDeleteMe() {
  return useMutation({
    mutationFn: userHandlers.deleteMe,
  });
}
