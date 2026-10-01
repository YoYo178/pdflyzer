import { API } from '@/api/client';
import type {
  TGetMeResponse,
  TUpdateMeRequest,
  TUpdateMeResponse,
} from './types';

async function getMe() {
  const response = await API.get<TGetMeResponse>('/users/me');

  return response.data;
}

async function updateMe(data: TUpdateMeRequest) {
  const response = await API.patch<TUpdateMeResponse>('/users/me', data);

  return response.data;
}

async function deleteMe() {
  const response = await API.delete('/users/me');

  return response.data;
}

export default { getMe, updateMe, deleteMe };
