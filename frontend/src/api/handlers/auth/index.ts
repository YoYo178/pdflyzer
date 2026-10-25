import { API } from '@/api/client';

import type {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  IResendEmailRequest,
  IResendEmailResponse,
  IVerifyEmailRequest,
  IVerifyEmailResponse,
} from './types';

async function login(data: ILoginRequest) {
  const response = await API.post<ILoginResponse>('/auth/login', data);

  return response.data;
}

async function register(data: IRegisterRequest) {
  const response = await API.post<IRegisterResponse>('/auth/register', data);

  return response.data;
}

async function verifyEmail(data: IVerifyEmailRequest) {
  const response = await API.post<IVerifyEmailResponse>('/auth/verify-email', data);

  return response.data;
}

async function resendEmail(data: IResendEmailRequest) {
  const response = await API.post<IResendEmailResponse>('/auth/resend-email', data);

  return response.data;
}

async function logout() {
  const response = await API.post('/auth/logout');

  return response.data;
}

export default {
  login,
  register,
  verifyEmail,
  resendEmail,
  logout,
};
