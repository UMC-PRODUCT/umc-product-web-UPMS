import type { ProjectApplicantsResponse } from '../api/getProjectApplicants';
import { toApplicants } from './toApplicants';

type ProjectApplicant = ProjectApplicantsResponse[number];

// 서버는 ID를 문자열로 줌
const applicant = (overrides: Partial<ProjectApplicant>): ProjectApplicant =>
  ({
    applicationId: '21',
    applicant: {
      memberId: '501',
      nickname: '로미',
      name: '신지혜',
      schoolName: '한국대',
      part: 'DESIGN',
    },
    matchingRound: { id: '7', type: 'PLAN_DESIGN', phase: 'SECOND' },
    status: 'APPROVED',
    submittedAt: '2026-10-01T10:00:00+09:00',
    statusChangedAt: '2026-10-03T18:30:00+09:00',
    ...overrides,
  }) as unknown as ProjectApplicant;

describe('toApplicants', () => {
  it('지원자 줄로 바꾸고 서버 상태를 배정 상태로 맞춘다', () => {
    expect(toApplicants([applicant({})])).toEqual([
      {
        applicantId: '21',
        applicationId: 21,
        matchingRoundId: 7,
        memberId: 501,
        round: 2,
        part: 'design',
        challengerName: '로미/신지혜',
        schoolName: '한국대',
        status: 'PASSED',
        appliedAt: '2026-10-01T10:00:00+09:00',
        processedAt: '2026-10-03T18:30:00+09:00',
      },
    ]);
  });

  it('한 번도 처리하지 않은 대기는 처리 시각이 없다', () => {
    const [waiting] = toApplicants([
      applicant({
        status: 'SUBMITTED',
        applicant: { part: 'WEB_PRODUCT_ENGINEER' },
        statusChangedAt: '2026-10-01T10:00:00+09:00',
      }),
    ]);

    expect(waiting).toMatchObject({ status: 'WAITING', part: 'web-pe', processedAt: null });
  });

  it('지원서 ID나 1~3차 차수가 없으면 뺀다', () => {
    expect(
      toApplicants([
        applicant({ applicationId: undefined }),
        applicant({ matchingRound: { phase: 'RANDOM_MATCHING' } }),
      ]),
    ).toEqual([]);
  });
});
