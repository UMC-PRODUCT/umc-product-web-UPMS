import { skipToken, useQuery } from '@tanstack/react-query';

import { getProjectApplicants } from '../api/getProjectApplicants';
import { applicationListKeys } from '../api/queryKeys';
import { toApplicants } from '../model/toApplicants';

// 프로젝트 하나의 지원자 전체 (PM 지원자 목록). 프로젝트를 모르면 부르지 않음
// 검색어 · 학교 · 파트는 서버 필터가 없어 받은 뒤 화면에서 거름 (filterPmApplicants)
export const useProjectApplicants = (projectId: number | null) =>
  useQuery({
    queryKey: applicationListKeys.applicants.project(projectId),
    queryFn: projectId === null ? skipToken : () => getProjectApplicants(projectId),
    select: toApplicants,
  });
