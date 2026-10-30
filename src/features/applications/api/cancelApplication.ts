import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-005'];

export type CancelApplicationResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

type CancelApplicationParams = {
  // 문서의 path 파라미터에는 applicationId만 있지만 주소에 projectId도 들어감
  projectId: number;
  applicationId: number;
  reason?: string; // 철회 사유 (선택)
};

/** 챌린저 지원서 철회 (지원 취소) */
export const cancelApplication = ({
  projectId,
  applicationId,
  reason,
}: CancelApplicationParams) => {
  // api.delete는 쿼리 파라미터를 받지 않아 사유는 주소에 직접 붙임
  const query = reason ? `?${new URLSearchParams({ reason })}` : '';
  return api.delete<CancelApplicationResponse>(
    `/api/v1/projects/${projectId}/applications/${applicationId}${query}`,
  );
};
