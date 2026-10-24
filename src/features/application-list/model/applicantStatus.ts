import type { StatusTagColor } from '@umc-product/react';

import type { ApplicantStatus } from './types';

export const APPLICANT_STATUS_TAG: Record<
  ApplicantStatus,
  { label: string; color: StatusTagColor }
> = {
  PASSED: { label: '합격', color: 'brand' },
  WAITING: { label: '대기', color: 'warning' },
  FAILED: { label: '불합격', color: 'error' },
};

// 피그마 배정 상태 변경 메뉴 순서
export const APPLICANT_STATUSES: ApplicantStatus[] = ['PASSED', 'FAILED', 'WAITING'];
