import { useGetMe } from '@/api/queries/users/useGetMe';
import { useMemo } from 'react';

export const useAuth = () => {
  const { data, isPending, isError, error } = useGetMe();

  const isAuthenticated = !!data?.id && !isError;

  const initials = useMemo(
    () =>
      data?.name
        ?.trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join('') ?? '',
    [data?.name],
  );

  const user = data ? { ...data, initials } : null;

  return {
    user,
    isAuthenticated,
    isLoading: isPending,
    isError,
    error,
  };
};
