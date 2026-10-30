import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-101-BATCH'];

export type ProjectsApplicantsQuery = Operation['parameters']['query'];
// projectId(문자열 키)별 지원자 목록
export type ProjectsApplicantsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** PM · 운영진 복수 프로젝트 지원자 목록 조회 (어드민 지원자 목록 표) */
export const getProjectsApplicants = ({ projectIds, ...query }: ProjectsApplicantsQuery) =>
  api.get<ProjectsApplicantsResponse>('/api/v1/projects/applications', {
    ...query,
    // axios 기본값은 배열을 projectIds[]=1&projectIds[]=2로 보내서 서버가 못 읽음. 쉼표로 이어 보냄
    projectIds: projectIds.join(','),
  });
