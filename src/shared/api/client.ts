import axios, { AxiosError } from 'axios';

export interface ApiResponse<T> {
  success?: boolean;
  code?: string;
  message?: string;
  result?: T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
});

apiClient.interceptors.response.use(undefined, (error: AxiosError<ApiResponse<unknown>>) => {
  const status = error.response?.status ?? 0;
  const body = error.response?.data;

  return Promise.reject(
    new ApiError(
      status,
      body?.code ?? (status === 0 ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR'),
      body?.message ?? '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
    ),
  );
});

const unwrap = <T>(body: ApiResponse<T>, status: number): T => {
  if (body.success === false) {
    throw new ApiError(status, body.code ?? 'UNKNOWN_ERROR', body.message ?? '요청에 실패했어요.');
  }
  return body.result as T;
};

export const api = {
  get: async <T>(url: string, params?: object) => {
    const res = await apiClient.get<ApiResponse<T>>(url, { params });
    return unwrap(res.data, res.status);
  },
  post: async <T>(url: string, body?: unknown) => {
    const res = await apiClient.post<ApiResponse<T>>(url, body);
    return unwrap(res.data, res.status);
  },
  put: async <T>(url: string, body?: unknown) => {
    const res = await apiClient.put<ApiResponse<T>>(url, body);
    return unwrap(res.data, res.status);
  },
  patch: async <T>(url: string, body?: unknown) => {
    const res = await apiClient.patch<ApiResponse<T>>(url, body);
    return unwrap(res.data, res.status);
  },
  delete: async <T>(url: string) => {
    const res = await apiClient.delete<ApiResponse<T>>(url);
    return unwrap(res.data, res.status);
  },
};
