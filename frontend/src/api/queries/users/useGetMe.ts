import { useQuery } from '@tanstack/react-query';
import userHandlers from '@/api/handlers/users';

export function useGetMe() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: userHandlers.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
