import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';

import { toId } from '@/shared/api/toId';

import { getProjectsApplicants } from '../api/getProjectsApplicants';
import { applicationListKeys } from '../api/queryKeys';
import { toApplicants } from '../model/toApplicants';
import type { Applicant } from '../model/types';

// 표 한 페이지 프로젝트들의 지원자를 한 번에 (프로젝트 ID → 지원자). 프로젝트가 없으면 부르지 않음
// 권한이 없거나 아직 볼 수 없는 차수(지부장은 지원 마감 후)는 서버가 빈 목록으로 줌
export const useProjectsApplicants = (projectIds: number[]) =>
  useQuery({
    queryKey: applicationListKeys.applicants.batch(projectIds),
    queryFn: projectIds.length === 0 ? skipToken : () => getProjectsApplicants({ projectIds }),
    placeholderData: keepPreviousData,
    select: (byProject) => {
      const result = new Map<number, Applicant[]>();
      for (const [key, applicants] of Object.entries(byProject)) {
        // 응답 키가 문자열 projectId라 숫자로 맞춤
        const projectId = toId(key);
        if (projectId !== null) result.set(projectId, toApplicants(applicants));
      }
      return result;
    },
  });
