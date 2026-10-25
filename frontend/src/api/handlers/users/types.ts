import type { IUser } from '@/types/user.types';

export type TGetMeResponse = IUser;

export type TUpdateMeRequest = Partial<{
  name: string;
  username: string;
  email: string;
}>;
export type TUpdateMeResponse = IUser | null;
