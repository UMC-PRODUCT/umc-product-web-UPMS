import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

export type GisuOrganizationResponse = components['schemas']['GisuOrganizationV2Response'];

/** 기수의 지부 목록 조회 (기수 조직 정보 조회에서 지부 · 지부 소속 학교 포함) */
// 문서에는 query가 request 객체로 묶여 있지만 실제로는 평평한 query (?id=6&includeChapter=true)
export const getChapters = (gisuId: number) =>
  api.get<GisuOrganizationResponse>('/api/v2/gisu', {
    id: gisuId,
    includeChapter: true,
    includeSchool: true,
  });
