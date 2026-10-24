import { useMutation } from '@tanstack/react-query';
import authHandlers from '@/api/handlers/auth';

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authHandlers.verifyEmail,
  });
}
