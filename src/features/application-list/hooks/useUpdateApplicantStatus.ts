import { useMutation, useQueryClient } from '@tanstack/react-query';

import { applicationListKeys } from '../api/queryKeys';
import {
  type ApplicationDecisionBody,
  updateApplicationDecision,
} from '../api/updateApplicationDecision';
import type { ApplicantStatus } from '../model/types';

// 배정 상태 → 서버 상태 (대기로 되돌리면 제출 상태)
const SERVER_STATUS: Record<ApplicantStatus, NonNullable<ApplicationDecisionBody['status']>> = {
  PASSED: 'APPROVED',
  FAILED: 'REJECTED',
  WAITING: 'SUBMITTED',
};

type UpdateApplicantStatusVariables = {
  projectId: number;
  applicationId: number;
  status: ApplicantStatus;
};

// 지원자 배정 상태 변경 (합격 · 불합격 · 대기)
export const useUpdateApplicantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, applicationId, status }: UpdateApplicantStatusVariables) =>
      updateApplicationDecision({ projectId, applicationId }, { status: SERVER_STATUS[status] }),
    // 바뀐 상태 · 처리 시각이 보이도록 지원자 목록, 지원 통계, 지원서를 다시 불러옴
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: applicationListKeys.applicants.all }),
        queryClient.invalidateQueries({ queryKey: ['application-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['applications', 'detail'] }),
      ]),
  });
};
