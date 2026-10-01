import { useGetMe } from '@/api/queries/users/useGetMe';
import type { IUser } from '@/types/user.types';
import { useMemo } from 'react';

export const useAuth = () => {
  const { data, isError, error: rawError } = useGetMe();

  const isAuthenticated = !!data?.id;

  const name = data?.name ?? '';
  const initials = useMemo(() => {
    return (
      name
        .split(' ')
        .map((arg) => arg[0])
        .join('') ?? ''
    );
  }, [name]);

  const user: Partial<IUser> & { initials: string } = {
    ...data,
    initials,
  };

  const error = isError ? rawError : null;

  return { isAuthenticated, user, error };
};
