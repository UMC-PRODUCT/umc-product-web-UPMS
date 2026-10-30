import { skipToken, useQuery } from '@tanstack/react-query';

import { getProjectsMembers, type ProjectsMembersResponse } from '@/entities/project';
import { toId } from '@/shared/api/toId';

export type ProjectMembers = ProjectsMembersResponse[string];

// 프로젝트들의 팀원 구성 (프로젝트 ID → 팀원). 프로젝트가 없으면 부르지 않음
// 권한이 없거나 조회에 실패한 프로젝트는 서버가 결과에서 뺌
export const useProjectsMembers = (projectIds: number[]) =>
  useQuery({
    queryKey: ['matching-status', 'members', projectIds],
    queryFn: projectIds.length === 0 ? skipToken : () => getProjectsMembers(projectIds),
    select: (byProject) => {
      const result = new Map<number, ProjectMembers>();
      for (const [key, members] of Object.entries(byProject)) {
        // 응답 키가 문자열 projectId라 숫자로 맞춤
        const projectId = toId(key);
        if (projectId !== null) result.set(projectId, members);
      }
      return result;
    },
  });
