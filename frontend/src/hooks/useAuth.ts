import { useGetMe } from '@/api/queries/users/useGetMe';
import { useMemo } from 'react';

export const useAuth = () => {
  const { data, isPending, isError, error } = useGetMe();

  const user = useMemo(() => {
    if (!data) return null;

    const initials =
      data.name
        ?.trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join('') ?? '';

    return { ...data, initials };
  }, [data]);

  return {
    user,
    isAuthenticated: !!data?.id,
    isLoading: isPending,
    isError,
    error,
  };
};
