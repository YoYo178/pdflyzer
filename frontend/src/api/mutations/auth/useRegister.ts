import { useMutation } from '@tanstack/react-query';
import authHandlers from '@/api/handlers/auth';

export function useRegister() {
  return useMutation({
    mutationFn: authHandlers.register,
  });
}
