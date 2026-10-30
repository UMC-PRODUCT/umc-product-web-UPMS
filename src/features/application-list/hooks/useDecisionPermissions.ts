import { skipToken, useQuery } from '@tanstack/react-query';

import { getProjectPermissions } from '@/entities/project';
import { toId } from '@/shared/api/toId';

// 프로젝트별로 지원서 합격 여부(배정 상태)를 정할 권한이 있는지 (서버 권한 기준)
// 서버 규칙: 담당 PM, 해당 기수 총괄 · 부총괄, 최고관리자만 가능 (지부장 · 학교 운영진은 조회만)
// 권한이 없어도 false로 옴. 프로젝트가 없으면 부르지 않음
export const useDecisionPermissions = (projectIds: number[]) =>
  useQuery({
    queryKey: ['project-permissions', projectIds],
    queryFn: projectIds.length === 0 ? skipToken : () => getProjectPermissions(projectIds),
    select: ({ projects = [] }) => {
      const result = new Map<number, boolean>();
      for (const { projectId, application } of projects) {
        // ID가 문자열로 와서 숫자로 맞춤
        const id = toId(projectId);
        if (id !== null) result.set(id, application?.canDecide?.allowed === true);
      }
      return result;
    },
  });
