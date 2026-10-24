import type { AppliedProject, AppliedRoundGroup, PartRecruitment } from './types';

const ALL_CLOSED: PartRecruitment[] = [
  { part: 'DESIGN', applied: 1, capacity: 1, status: 'CLOSED' },
  { part: 'WEB_PE', applied: 0, capacity: 0, status: 'CLOSED' },
];

const mockProject = (
  projectId: string,
  overrides: Pick<AppliedProject, 'recruitments' | 'result'> &
    Partial<Pick<AppliedProject, 'applicationEditable'>>,
): AppliedProject => ({
  projectId,
  projectName: '프로젝트 명',
  logoUrl: null,
  thumbnailUrl: null,
  pmName: '닉네임/이름',
  schoolName: '한국대',
  description:
    '프로젝트 한 줄 소개가 여기에 표시됩니다. 초과 내용 ... 처리 없이 설명 전문이 표시됩니다. 본문 내용 공백 포함 200자 이내 약 4줄 표시됩니다.',
  platform: 'WEB',
  applicationEditable: false,
  ...overrides,
});

// TODO: 내 지원 목록 API 연동
export const MOCK_APPLIED_ROUNDS: AppliedRoundGroup[] = [
  {
    roundId: 'plan-design-1',
    roundName: 'Plan-Design 1차 매칭',
    matchingType: 'REGULAR',
    projects: [mockProject('project-1', { recruitments: ALL_CLOSED, result: 'FAILED' })],
  },
  {
    roundId: 'plan-design-2',
    roundName: 'Plan-Design 2차 매칭',
    matchingType: 'REGULAR',
    projects: [mockProject('project-2', { recruitments: ALL_CLOSED, result: 'FAILED' })],
  },
  {
    roundId: 'plan-design-3',
    roundName: 'Plan-Design 3차 매칭',
    matchingType: 'REGULAR',
    projects: [mockProject('project-3', { recruitments: ALL_CLOSED, result: 'FAILED' })],
  },
  {
    roundId: 'plan-design-random',
    roundName: 'Plan-Design 랜덤 매칭',
    matchingType: 'RANDOM',
    projects: [
      mockProject('project-4', {
        recruitments: [
          { part: 'DESIGN', applied: 1, capacity: 1, status: 'RECRUITING' },
          { part: 'WEB_PE', applied: 0, capacity: 0, status: 'CLOSED' },
        ],
        result: null,
        applicationEditable: true,
      }),
    ],
  },
];
