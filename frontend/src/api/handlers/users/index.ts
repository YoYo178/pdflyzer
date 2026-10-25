import { API } from '@/api/client';
import { isUnauthorized } from '@/api/utils';
import type {
  TGetMeResponse,
  TUpdateMeRequest,
  TUpdateMeResponse,
} from './types';

async function getMe(): Promise<TGetMeResponse | null> {
  try {
    const response = await API.get<TGetMeResponse>('/users/me');

    return response.data;
  } catch (error) {
    if (isUnauthorized(error)) return null;

    throw error;
  }
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
