import type { ProjectsResponse } from '@/entities/project';

import { toProjectApplicationRow } from './toProjectApplicationRow';

type ProjectSummary = NonNullable<ProjectsResponse['content']>[number];

// 서버는 ID를 문자열로 줌
const project = (overrides: Partial<ProjectSummary>): ProjectSummary =>
  ({
    id: '3',
    name: 'UMC Web',
    productOwner: { nickname: '벨라', name: '황지원', schoolName: '중앙대' },
    partQuotas: [
      { part: 'PLAN', currentCount: 1, quota: 1, status: 'COMPLETED' },
      { part: 'DESIGN', currentCount: 1, quota: 2, status: 'RECRUITING' },
      { part: 'WEB_PRODUCT_ENGINEER', currentCount: 3, quota: 4, status: 'RECRUITING' },
    ],
    partQuotaStatus: 'RECRUITING',
    ...overrides,
  }) as unknown as ProjectSummary;

describe('toProjectApplicationRow', () => {
  it('프로젝트 줄로 바꾸고 웹 PE만 모집하면 모바일 칸은 비운다', () => {
    expect(toProjectApplicationRow(project({}))).toEqual({
      projectId: 3,
      projectName: 'UMC Web',
      part: 'pm',
      challengerName: '벨라/황지원',
      schoolName: '중앙대',
      recruitStatus: 'RECRUITING',
      recruitments: {
        DESIGN: { applied: 1, capacity: 2 },
        WEB_PE: { applied: 3, capacity: 4 },
        MOBILE_PE: null,
      },
    });
  });

  it('모바일 PE를 모집하면 웹 칸을 비우고, 모집 완료는 CLOSED', () => {
    const row = toProjectApplicationRow(
      project({
        partQuotas: [{ part: 'MOBILE_PRODUCT_ENGINEER', currentCount: 3, quota: 3 }],
        partQuotaStatus: 'COMPLETED',
      }),
    );

    expect(row?.recruitments).toEqual({
      DESIGN: { applied: 0, capacity: 0 },
      WEB_PE: null,
      MOBILE_PE: { applied: 3, capacity: 3 },
    });
    expect(row?.recruitStatus).toBe('CLOSED');
  });

  it('ID가 없으면 null', () => {
    expect(toProjectApplicationRow(project({ id: undefined }))).toBeNull();
  });
});
