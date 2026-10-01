import { API } from '@/api/client';

import type {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  TRegisterResponse,
} from './types';

async function login(data: ILoginRequest) {
  const response = await API.post<ILoginResponse>('/auth/login', data);

  return response.data;
}

async function register(data: IRegisterRequest) {
  const response = await API.post<TRegisterResponse>('/auth/register', data);

  return response.data;
}

async function logout() {
  const response = await API.post('/auth/logout');

  return response.data;
}

export default {
  login,
  register,
  logout,
};
