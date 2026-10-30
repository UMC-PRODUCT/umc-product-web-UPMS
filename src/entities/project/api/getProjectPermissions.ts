import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-PERMISSIONS-001'];

export type ProjectPermissionsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 프로젝트 capability 일괄 조회 (배정 상태 변경 · 수동 배정 · 매칭 해제를 할 수 있는지 등) */
export const getProjectPermissions = (projectIds: number[]) =>
  api.get<ProjectPermissionsResponse>('/api/v1/projects/permissions', {
    // axios 기본값은 배열을 ids[]=1&ids[]=2로 보내서 서버가 못 읽음. 쉼표로 이어 보냄
    ids: projectIds.join(','),
  });
