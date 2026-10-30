import type { MatchingOverviewResponse } from '../api/getMatchingOverview';
import { toMatchingResults } from './toMatchingResults';

type OverviewProject = NonNullable<MatchingOverviewResponse['projects']>[number];

// 서버는 ID · 인원 수를 문자열로 줌
const projects = [
  {
    projectId: '3',
    projectName: 'UMC Web',
    productOwner: { nickname: '벨라', name: '황지원', schoolName: '중앙대' },
    partQuotaStatus: 'RECRUITING',
    parts: [
      { part: 'PLAN', quota: '1', members: [] },
      {
        part: 'DESIGN',
        quota: '2',
        members: [
          {
            memberId: '501',
            nickname: '로미',
            name: '신지혜',
            schoolName: '한국대',
            matchedRoundInfo: { phase: 'SECOND' },
          },
          // 지원 없이 수동 배정 (매칭 차수 없음)
          { memberId: '502', nickname: '하늘', name: '박경운', schoolName: '중앙대' },
        ],
      },
      { part: 'WEB_PRODUCT_ENGINEER', quota: '4', members: [] },
    ],
  },
  {
    projectId: '4',
    projectName: '모아모아',
    productOwner: { nickname: '이방토', name: '이예원', schoolName: '한양대 ERICA' },
    partQuotaStatus: 'COMPLETED',
    parts: [
      { part: 'DESIGN', quota: '1', members: [] },
      { part: 'MOBILE_PRODUCT_ENGINEER', quota: '3', members: [] },
    ],
  },
] as unknown as OverviewProject[];

describe('toMatchingResults', () => {
  it('PE 플랫폼별로 나누고 파트 칸에 매칭된 챌린저를 채운다', () => {
    const [web, mobile] = toMatchingResults(projects);

    expect(web.platform).toBe('WEB');
    expect(web.projects).toEqual([
      {
        projectId: 3,
        projectName: 'UMC Web',
        pmName: '벨라/황지원',
        pmSchoolName: '중앙대',
        recruiting: true,
        parts: [
          {
            part: 'DESIGN',
            partLabel: 'Design',
            capacity: 2,
            members: [
              {
                memberId: 501,
                challengerName: '로미/신지혜',
                schoolName: '한국대',
                round: 2,
                matchedAt: null,
                submittedAt: null,
              },
              expect.objectContaining({ memberId: 502, round: 'RANDOM' }),
            ],
          },
          { part: 'WEB_PE', partLabel: 'Web', capacity: 4, members: [] },
        ],
      },
    ]);
    expect(mobile).toMatchObject({
      platform: 'MOBILE',
      projects: [
        { projectId: 4, recruiting: false, parts: [{ part: 'DESIGN' }, { partLabel: 'Mobile' }] },
      ],
    });
  });
});
