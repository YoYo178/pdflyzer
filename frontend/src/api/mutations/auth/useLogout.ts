import { useMutation } from '@tanstack/react-query';
import authHandlers from '@/api/handlers/auth';

export function useLogout() {
  return useMutation({
    mutationFn: authHandlers.logout,
  });
}
