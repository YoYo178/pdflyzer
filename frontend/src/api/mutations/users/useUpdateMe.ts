import userHandlers from '@/api/handlers/users';
import { useMutation } from '@tanstack/react-query';

export function useUpdateMe() {
  return useMutation({
    mutationFn: userHandlers.updateMe,
  });
}
