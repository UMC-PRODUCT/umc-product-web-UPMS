import { api } from '@/shared/api/client';
import type { components, operations } from '@/types/api';

type GetOperation = operations['PROJECT-QUOTAS-001'];

export type QuotaManagementResponse = NonNullable<GetOperation['responses'][200]['content']['*/*']>;
export type SaveQuotaManagementRequest = components['schemas']['SaveProjectQuotaManagementRequest'];
export type QuotaCellChange = components['schemas']['CellChange'];

/** 프로젝트 TO 관리 화면 조회 (지부의 프로젝트 목록이 들어 있어 프로젝트의 지부를 찾는 데 씀) */
export const getQuotaManagement = (query: { gisuId: number; chapterId?: number }) =>
  api.get<QuotaManagementResponse>('/api/v1/projects/admin/part-quotas', query);

/** 변경한 프로젝트 TO 셀 일괄 저장 (보낸 셀만 바뀌고 quota 0은 해당 파트 TO 제거) */
export const saveQuotaManagement = (body: SaveQuotaManagementRequest) =>
  api.patch<unknown>('/api/v1/projects/admin/part-quotas', body);
