import { useMutation } from '@tanstack/react-query';
import authHandlers from '@/api/handlers/auth';

export function useResendEmail() {
  return useMutation({
    mutationFn: authHandlers.resendEmail,
  });
}
