import axios from 'axios';
import { APIError } from './utils';

const API_URL = new URL('/api', import.meta.env.VITE_API_URL);

export const API = axios.create({
  baseURL: API_URL.toString(),
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.message ??
        'Something went wrong';

      return Promise.reject(
        new APIError(
          message,
          error.response?.status ?? 500,
          error.response?.data?.data !== undefined ? error.response?.data?.data : error.response?.data,
        ),
      );
    }

    return Promise.reject(error);
  },
);
