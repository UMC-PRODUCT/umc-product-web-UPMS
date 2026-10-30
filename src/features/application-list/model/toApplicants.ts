import type { PartTagPart } from '@umc-product/react';

import { toId } from '@/shared/api/toId';

import type { ProjectApplicantsResponse } from '../api/getProjectApplicants';
import type { Applicant, ApplicantStatus } from './types';

type ProjectApplicant = ProjectApplicantsResponse[number];
type ServerPart = NonNullable<NonNullable<ProjectApplicant['applicant']>['part']>;
type ServerPhase = NonNullable<NonNullable<ProjectApplicant['matchingRound']>['phase']>;

// 서버 파트 → 파트 태그 (지원자는 Design · PE만, 나머지는 쓰이지 않지만 PM으로 둠)
const PART_TAG: Partial<Record<ServerPart, PartTagPart>> = {
  DESIGN: 'design',
  WEB_PRODUCT_ENGINEER: 'web-pe',
  MOBILE_PRODUCT_ENGINEER: 'mobile-pe',
};

// 지원서는 1~3차에만 있음 (랜덤 매칭은 지원서 없이 배정)
const ROUND: Partial<Record<ServerPhase, Applicant['round']>> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
};

// 서버 상태 → 배정 상태 (제출만 한 상태가 대기)
const STATUS: Record<NonNullable<ProjectApplicant['status']>, ApplicantStatus> = {
  SUBMITTED: 'WAITING',
  APPROVED: 'PASSED',
  REJECTED: 'FAILED',
};

// 프로젝트 지원자 목록 → 표 · 상세 모달의 지원자. 지원서 ID나 차수가 없으면 뺌
export const toApplicants = (applicants: ProjectApplicantsResponse): Applicant[] =>
  applicants.flatMap(({ applicationId, applicant, matchingRound, status, ...times }) => {
    // ID가 문자열로 와서 숫자로 맞춤
    const id = toId(applicationId);
    const round = matchingRound?.phase && ROUND[matchingRound.phase];
    if (id === null || !round) return [];

    const waiting = status === undefined || status === 'SUBMITTED';
    return [
      {
        applicantId: String(id),
        applicationId: id,
        matchingRoundId: toId(matchingRound?.id),
        memberId: toId(applicant?.memberId),
        round,
        part: (applicant?.part && PART_TAG[applicant.part]) ?? 'pm',
        challengerName: [applicant?.nickname, applicant?.name].filter(Boolean).join('/'),
        schoolName: applicant?.schoolName ?? '',
        status: status ? STATUS[status] : 'WAITING',
        appliedAt: times.submittedAt ?? '',
        // 한 번도 처리하지 않은 대기는 상태 변경 시각이 제출 시각과 같아서 "-"로 표시
        processedAt:
          waiting && times.statusChangedAt === times.submittedAt
            ? null
            : (times.statusChangedAt ?? null),
      },
    ];
  });
