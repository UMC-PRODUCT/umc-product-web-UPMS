import type { MyApplicationsResponse } from '../api/getMyApplications';
import { toAppliedRoundGroups } from './toAppliedRoundGroups';

type MyApplication = MyApplicationsResponse[number];

const project: MyApplication['project'] = {
  name: 'UMC Web',
  thumbnailImageUrl: '',
  productOwner: { memberId: 1, nickname: '벨라', name: '황지원', schoolName: '중앙대' },
  partQuotas: [
    { part: 'PLAN', currentCount: 1, quota: 1, status: 'COMPLETED' },
    { part: 'DESIGN', currentCount: 1, quota: 2, status: 'RECRUITING' },
    { part: 'WEB_PRODUCT_ENGINEER', currentCount: 4, quota: 4, status: 'COMPLETED' },
  ],
};

// 서버는 ID를 문자열로 줌
const application = (overrides: Partial<MyApplication>): MyApplication =>
  ({
    applicationId: '10',
    projectId: '3',
    project,
    matchingRound: { id: '7', type: 'PLAN_DESIGN', phase: 'FIRST' },
    status: 'SUBMITTED',
    ...overrides,
  }) as unknown as MyApplication;

describe('toAppliedRoundGroups', () => {
  it('지원서를 카드로 바꾸고 모집 파트 · PM · 플랫폼을 채운다', () => {
    const [group] = toAppliedRoundGroups([application({})], new Set());

    expect(group).toMatchObject({
      roundId: '7',
      roundName: 'Plan-Design 1차 매칭',
      matchingType: 'REGULAR',
    });
    expect(group.projects[0]).toEqual({
      applicationId: 10,
      projectId: 3,
      projectName: 'UMC Web',
      thumbnailUrl: null,
      pmName: '벨라/황지원',
      schoolName: '중앙대',
      platform: 'WEB',
      recruitments: [
        { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
        { part: 'WEB_PE', applied: 4, capacity: 4, status: 'CLOSED' },
      ],
      applicationEditable: false,
      result: null,
    });
  });

  it('같은 차수끼리 묶고, 지원 기간인 차수만 취소할 수 있다', () => {
    const groups = toAppliedRoundGroups(
      [
        application({ applicationId: 1 }),
        application({ applicationId: 2 }),
        application({
          applicationId: 3,
          matchingRound: { id: 8, type: 'PLAN_DEVELOPER', phase: 'SECOND' },
        }),
      ],
      new Set([8]),
    );

    expect(groups.map(({ roundName, projects }) => [roundName, projects.length])).toEqual([
      ['Plan-Design 1차 매칭', 2],
      ['Plan-PE 2차 매칭', 1],
    ]);
    expect(groups[1].projects[0].applicationEditable).toBe(true);
  });

  it('발표된 결과만 합격 · 불합격으로 보여 주고 철회한 지원서는 뺀다', () => {
    const [group] = toAppliedRoundGroups(
      [
        application({ applicationId: 1, status: 'APPROVED' }),
        application({ applicationId: 2, status: 'REJECTED' }),
        application({ applicationId: 3, status: 'CANCELLED' }),
      ],
      new Set(),
    );

    expect(group.projects.map(({ result }) => result)).toEqual(['PASSED', 'FAILED']);
  });

  it('랜덤 매칭 카드는 지원서 없이 따로 묶는다', () => {
    const [group] = toAppliedRoundGroups(
      [
        application({
          applicationId: undefined,
          matchingRound: { type: 'PLAN_DESIGN', phase: 'RANDOM_MATCHING' },
          status: 'APPROVED',
        }),
      ],
      new Set(),
    );

    expect(group).toMatchObject({ roundName: 'Plan-Design 랜덤 매칭', matchingType: 'RANDOM' });
    expect(group.projects[0]).toMatchObject({ applicationId: null, applicationEditable: false });
  });
});
