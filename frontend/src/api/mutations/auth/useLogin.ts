import { useMutation } from '@tanstack/react-query';
import authHandlers from '@/api/handlers/auth';

export function useLogin() {
  return useMutation({
    mutationFn: authHandlers.login,
  });
}
