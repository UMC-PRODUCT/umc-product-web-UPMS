import { useState } from 'react';

import {
  type Applicant,
  type ApplicantStatus,
  useDecisionPermissions,
  useUpdateApplicantStatus,
} from '@/features/application-list';
import { getDecisionOpenRoundIds, useMatchingRounds } from '@/features/matching-schedule';
import { useAppToast } from '@/widgets/toast';

// 지원 현황(어드민 · PM)의 배정 상태 변경
// 바꿀 수 있는 조건 (서버 규칙과 같게): 프로젝트 권한(canDecide) + 지원자 차수가 결정 기간(지원 마감 ~ 결정 마감)
export const useApplicantStatusControl = (chapterId: number | null, projectIds: number[]) => {
  const [now] = useState(() => new Date());
  const toast = useAppToast();
  const { data: permissions } = useDecisionPermissions(projectIds);
  const { data: rounds } = useMatchingRounds(chapterId ?? undefined);
  const openRoundIds = getDecisionOpenRoundIds(rounds ?? [], now);
  const updateStatus = useUpdateApplicantStatus();

  const canChangeStatus = (projectId: number) => (applicant: Applicant) =>
    permissions?.get(projectId) === true &&
    applicant.matchingRoundId !== null &&
    openRoundIds.has(applicant.matchingRoundId);

  const changeStatus =
    (projectId: number) =>
    ({ applicationId, status: previous }: Applicant, status: ApplicantStatus) => {
      if (status === previous) return;
      updateStatus.mutate(
        { projectId, applicationId, status },
        // 서버가 거절하면(결정 기간이 지났거나 같은 차수에 다른 활성 지원서 등) 사유를 보여 줌
        { onError: (error) => toast.show(error.message, { color: 'error' }) },
      );
    };

  return { canChangeStatus, changeStatus, isUpdating: updateStatus.isPending };
};
