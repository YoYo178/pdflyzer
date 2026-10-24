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

export interface IRegisterResponse {
  message: string;
  data?: {
    user_id: string;
  };
}

export type TRegisterResponse = IRegisterResponse;

export interface IVerifyEmailRequest {
  user_id: string;
  method: 'code' | 'token';
  data: string;
}

export interface IVerifyEmailResponse {
  message: string;
  data?: {
    user?: IUser;
  };
}

export interface IResendEmailRequest {
  user_id: string;
}

export interface IResendEmailResponse {
  message: string;
}

export const OAUTH_PROVIDERS = ['google', 'github'] as const;

export type TOAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export type TOAuthMode = 'login' | 'register';
