import { API } from '@/api/client';

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './types';

async function login(data: LoginRequest) {
  const response = await API.post<LoginResponse>('/api/auth/login', data);

  return response.data;
}

async function register(data: RegisterRequest) {
  const response = await API.post<RegisterResponse>('/auth/register', data);

  return response.data;
}

export default {
  login,
  register,
};
