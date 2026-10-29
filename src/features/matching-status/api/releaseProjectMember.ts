import { api } from '@/shared/api/client';

type ReleaseProjectMemberParams = {
  projectId: number;
  memberId: number;
  reason?: string; // 해제 사유 (선택)
};

/** 운영진 매칭 해제 (팀 소속 해제 + 연결 지원서는 불합격. 차수 · 마감 제한 없음) */
export const releaseProjectMember = ({
  projectId,
  memberId,
  reason,
}: ReleaseProjectMemberParams) => {
  // api.delete는 쿼리 파라미터를 받지 않아 사유는 주소에 직접 붙임
  const query = reason ? `?${new URLSearchParams({ reason })}` : '';
  return api.delete<unknown>(`/api/v1/projects/admin/${projectId}/members/${memberId}${query}`);
};
