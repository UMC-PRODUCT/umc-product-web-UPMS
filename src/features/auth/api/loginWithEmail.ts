import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

type LoginRequest = components['schemas']['LoginByEmailRequest'];
type LoginResponse = components['schemas']['LocalLoginResponse'];

/** 이메일 · 비밀번호로 로그인해 토큰을 바로 받음 (LOGIN-011) */
export const loginWithEmail = (body: Omit<LoginRequest, 'clientType'>) =>
  api.post<LoginResponse>('/api/v1/auth/login/email', { ...body, clientType: 'WEB' });
