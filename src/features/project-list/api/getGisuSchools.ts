import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

type GisuOrganizationResponse = components['schemas']['GisuOrganizationV2Response'];

/** 기수의 학교 목록 조회 (기수 조직 정보에서 학교만 포함) */
// getChapters와 같이 문서에는 request 객체지만 실제로는 평평한 query (?id=6&includeSchool=true)
export const getGisuSchools = (gisuId: number) =>
  api.get<GisuOrganizationResponse>('/api/v2/gisu', { id: gisuId, includeSchool: true });
