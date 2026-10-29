import { type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

import { assignProjectMember } from '../api/assignProjectMember';
import { releaseProjectMember } from '../api/releaseProjectMember';
import { SERVER_PART } from '../model/serverPart';
import type { MatchingPart } from '../model/types';

// 팀 구성이 바뀌면 매칭 통계 · 결과 시트 · 후보, 지원자 목록 · 지원 통계(해제 시 지원서가 불합격으로 바뀜)를 다시 불러옴
const invalidateMatching = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['matching-status'] }),
    queryClient.invalidateQueries({ queryKey: ['project-applicants'] }),
    queryClient.invalidateQueries({ queryKey: ['application-stats'] }),
  ]);

type AssignVariables = { projectId: number; memberId: number; part: MatchingPart };

// 수동 배정 (빈 칸에 미배정 챌린저를 넣음)
export const useAssignProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, part }: AssignVariables) =>
      assignProjectMember(projectId, { memberId, part: SERVER_PART[part] }),
    onSuccess: () => invalidateMatching(queryClient),
  });
};

// 매칭 해제 (팀 소속 해제 + 연결 지원서 불합격)
export const useReleaseProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: releaseProjectMember,
    onSuccess: () => invalidateMatching(queryClient),
  });
};
