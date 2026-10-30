import { skipToken, useQuery } from '@tanstack/react-query';

import { getProjectPermissions } from '@/entities/project';
import { toId } from '@/shared/api/toId';

export type MatchingPermission = {
  canAssign: boolean; // 빈 칸 수동 배정
  canUnassign: boolean; // 매칭 해제
  assignDeniedReason: string | null; // 배정할 수 없을 때 서버가 알려 준 이유
};

// 프로젝트별 수동 배정 · 매칭 해제 권한 (서버 권한 기준. 권한이 없어도 false로 옴)
// 권한표: 마스터는 전 지부, 지부장은 소속 지부 프로젝트만. 프로젝트가 없으면 부르지 않음
export const useMatchingPermissions = (projectIds: number[]) =>
  useQuery({
    queryKey: ['project-permissions', projectIds],
    queryFn: projectIds.length === 0 ? skipToken : () => getProjectPermissions(projectIds),
    select: ({ projects = [] }) => {
      const result = new Map<number, MatchingPermission>();
      for (const { projectId, member } of projects) {
        // ID가 문자열로 와서 숫자로 맞춤
        const id = toId(projectId);
        if (id === null) continue;
        result.set(id, {
          canAssign: member?.canAssign?.allowed === true,
          canUnassign: member?.canUnassign?.allowed === true,
          assignDeniedReason: member?.canAssign?.reason || null,
        });
      }
      return result;
    },
  });
