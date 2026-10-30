import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-007'];

// projectId(문자열 키)별 팀원 구성 (PM · 보조 PM · 파트별 팀원)
export type ProjectsMembersResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 프로젝트 팀원 구성 일괄 조회 (어드민 지원자 목록 표의 보조 PM 줄) */
export const getProjectsMembers = (projectIds: number[]) =>
  api.get<ProjectsMembersResponse>('/api/v1/projects/members', {
    // axios 기본값은 배열을 projectIds[]=1&projectIds[]=2로 보내서 서버가 못 읽음. 쉼표로 이어 보냄
    projectIds: projectIds.join(','),
  });
