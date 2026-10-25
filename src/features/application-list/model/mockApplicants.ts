import {
  MOCK_NO_APPLICANT_PROJECT_ID,
  MOCK_PROJECT_APPLICATION_ROWS,
} from './mockProjectApplicationRows';
import type { Applicant, ApplicantStatus, ProjectApplicationGroup } from './types';

const createApplicant = (
  index: number,
  round: Applicant['round'],
  status: ApplicantStatus,
): Applicant => ({
  applicantId: String(index),
  round,
  part: 'design',
  challengerName: '닉네임/이름',
  schoolName: '한국대',
  status,
  appliedAt: '2026-10-01T10:00:00+09:00',
  // 대기는 마지막으로 대기를 누른 시각
  processedAt: status === 'WAITING' ? '2026-10-02T14:20:00+09:00' : '2026-10-03T18:30:00+09:00',
});

// 피그마와 같은 지원자 9명 + 페이지 확인용 4명
const MOCK_APPLICANTS: Applicant[] = [
  createApplicant(1, 1, 'FAILED'),
  createApplicant(2, 1, 'FAILED'),
  createApplicant(3, 2, 'FAILED'),
  createApplicant(4, 2, 'FAILED'),
  createApplicant(5, 2, 'FAILED'),
  createApplicant(6, 2, 'FAILED'),
  createApplicant(7, 3, 'WAITING'),
  createApplicant(8, 3, 'WAITING'),
  createApplicant(9, 3, 'PASSED'),
  // 2페이지 확인용 (10명씩 페이지 구분)
  createApplicant(10, 3, 'WAITING'),
  createApplicant(11, 3, 'WAITING'),
  createApplicant(12, 3, 'PASSED'),
  createApplicant(13, 3, 'FAILED'),
];

// TODO: 지원 목록 API 연동 시 제거. 어드민 뷰: 프로젝트 여러 개
export const MOCK_PROJECT_APPLICATION_GROUPS: ProjectApplicationGroup[] =
  MOCK_PROJECT_APPLICATION_ROWS.map((project) => ({
    project,
    coPms: [],
    applicants:
      project.projectId === MOCK_NO_APPLICANT_PROJECT_ID
        ? []
        : MOCK_APPLICANTS.map((applicant) => ({
            ...applicant,
            applicantId: `${project.projectId}-${applicant.applicantId}`,
          })),
  }));

// TODO: 내 프로젝트 API 연동 시 제거. PM 뷰: 내 프로젝트 하나 (더블 PM 화면 확인용)
export const MOCK_MY_PROJECT_APPLICATION_GROUP: ProjectApplicationGroup = {
  project: {
    projectId: 'my-project',
    projectName: 'UMC Web',
    part: 'pm',
    challengerName: '벨라/황지원',
    schoolName: '중앙대',
    recruitStatus: 'RECRUITING',
    recruitments: {
      DESIGN: { applied: 1, capacity: 2 },
      WEB_PE: { applied: 3, capacity: 4 },
      MOBILE_PE: null, // Web PE만 모집
    },
  },
  coPms: [{ challengerName: '닉네임/이름', schoolName: '한국대' }],
  applicants: MOCK_APPLICANTS,
};
