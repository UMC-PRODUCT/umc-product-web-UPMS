import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['MEMBER-201'];

export type MyInfoResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 내 종합 정보 조회 (슈퍼어드민 여부 · 현재 기수 역할 · 챌린저 기록) */
export const getMyInfo = () => api.get<MyInfoResponse>('/api/v2/member/me');
