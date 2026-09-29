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

export const OAUTH_PROVIDERS = ['google', 'github'] as const;

export type TOAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export type TOAuthMode = 'login' | 'register';
