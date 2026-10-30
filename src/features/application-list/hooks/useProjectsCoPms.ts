import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';

import { getProjectsMembers } from '@/entities/project';
import { toId } from '@/shared/api/toId';

import type { ProjectCoPm } from '../model/types';

// 표 한 페이지 프로젝트들의 보조 PM (프로젝트 ID → 보조 PM). 프로젝트가 없으면 부르지 않음
// 권한이 없거나 조회에 실패한 프로젝트는 서버가 결과에서 빼서 보조 PM 없음으로 보임
export const useProjectsCoPms = (projectIds: number[]) =>
  useQuery({
    queryKey: ['project-members', 'batch', projectIds],
    queryFn: projectIds.length === 0 ? skipToken : () => getProjectsMembers(projectIds),
    placeholderData: keepPreviousData,
    select: (byProject) => {
      const result = new Map<number, ProjectCoPm[]>();
      for (const [key, { coProductOwners = [] }] of Object.entries(byProject)) {
        // 응답 키가 문자열 projectId라 숫자로 맞춤
        const projectId = toId(key);
        if (projectId === null) continue;
        result.set(
          projectId,
          coProductOwners.map(({ nickname, name, schoolName }) => ({
            challengerName: [nickname, name].filter(Boolean).join('/'),
            schoolName: schoolName ?? '',
          })),
        );
      }
      return result;
    },
  });
