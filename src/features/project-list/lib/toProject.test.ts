import { describe, expect, it } from 'vitest';

import { applyProjectDetail, toProject } from './toProject';

const summary = {
  id: '7' as unknown as number, // 서버가 ID를 문자열로 내려줌
  name: 'UMC Web',
  description: '소개',
  thumbnailImageUrl: '',
  productOwner: { nickname: '방토', name: '이예원', schoolName: '한국대' },
  partQuotas: [
    {
      part: 'MOBILE_PRODUCT_ENGINEER' as const,
      currentCount: 1,
      quota: 4,
      status: 'RECRUITING' as const,
    },
    { part: 'DESIGN' as const, currentCount: 2, quota: 2, status: 'COMPLETED' as const },
    { part: 'PLAN' as const, currentCount: 1, quota: 1, status: 'COMPLETED' as const },
  ],
};

describe('toProject', () => {
  it('Design → PE 순서로 모집 현황을 만들고 PLAN은 뺌', () => {
    const project = toProject(summary, '3');
    expect(project).toMatchObject({
      projectId: '7',
      pmName: '방토/이예원',
      schoolName: '한국대',
      chapterId: '3',
      thumbnailUrl: null,
      platform: 'MOBILE',
    });
    expect(project.recruitments.map(({ part, status }) => [part, status])).toEqual([
      ['DESIGN', 'CLOSED'],
      ['MOBILE_PE', 'RECRUITING'],
    ]);
  });
});

describe('applyProjectDetail', () => {
  it('상세의 로고 · 기획 링크와 팀원 구성(차수)을 덧붙임', () => {
    const project = applyProjectDetail(
      toProject(summary, null),
      { logoImageUrl: 'logo.png', externalLink: 'https://figma.com' },
      {
        partGroups: [
          {
            part: 'DESIGN',
            members: [
              {
                memberId: 1,
                nickname: 'a',
                name: 'b',
                schoolName: 's',
                matchedRoundInfo: { phase: 'RANDOM_MATCHING' },
              },
              { memberId: 2, nickname: 'c', name: 'd', schoolName: 's' },
            ],
          },
        ],
      },
    );
    expect(project.logoUrl).toBe('logo.png');
    expect(project.planUrl).toBe('https://figma.com');
    expect(project.recruitments[0].members).toEqual([
      { memberId: '1', challengerName: 'a/b', schoolName: 's', round: 'RANDOM' },
    ]);
  });
});
