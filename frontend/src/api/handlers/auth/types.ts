import type { IUser } from '@/types/user.types';

export interface ILoginRequest {
  login: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
}

export interface IRegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export type TRegisterResponse = IUser;
