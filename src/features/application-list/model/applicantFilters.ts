import type { OptionItem } from '@umc-product/react';

import type { Applicant, ApplicantStatus } from './types';

export type ApplicantRoundFilter = 'ALL' | '1' | '2' | '3';
export type ApplicantStatusFilter = 'ALL' | ApplicantStatus;

export const APPLICANT_ROUND_OPTIONS: OptionItem<ApplicantRoundFilter>[] = [
  { value: 'ALL', label: '전체' },
  { value: '1', label: '1차' },
  { value: '2', label: '2차' },
  { value: '3', label: '3차' },
];

export const APPLICANT_STATUS_OPTIONS: OptionItem<ApplicantStatusFilter>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PASSED', label: '합격' },
  { value: 'FAILED', label: '불합격' },
  { value: 'WAITING', label: '대기' },
];

// 프로젝트 상세 모달의 차수 · 지원 상태 필터 (프로젝트 하나 분량이라 받은 지원자를 화면에서 거름)
export const filterApplicants = (
  applicants: Applicant[],
  round: ApplicantRoundFilter,
  status: ApplicantStatusFilter,
) =>
  applicants.filter(
    (applicant) =>
      (round === 'ALL' || String(applicant.round) === round) &&
      (status === 'ALL' || applicant.status === status),
  );
