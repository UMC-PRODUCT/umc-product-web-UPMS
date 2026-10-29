import type { ApplicationStatisticsResponse } from '../api/getApplicationStatistics';
import { getCurrentRoundSummary, getRoundApplicationStats } from './getRoundApplicationStats';
import { getSchoolApplicantStats } from './getSchoolApplicantStats';
import {
  getCurrentRound,
  toProjectApplications,
  toRoundProgress,
  toTotalApplicants,
} from './toApplicationStatistics';

const design = (phase: 'FIRST' | 'SECOND') => ({
  matchingRoundId: '18',
  type: 'PLAN_DESIGN' as const,
  phase,
});

// 개발 서버 실제 응답 (/api/v1/projects/statistics/applications?chapterId=51) 기준. 2차는 확인용으로 추가
const statistics: ApplicationStatisticsResponse = {
  chapterId: '51',
  matchingRound: design('FIRST'),
  summary: {
    roundApplicationStatistics: [
      { matchingRound: design('FIRST'), appliedMemberCount: '15', availableMemberCount: '15' },
      {
        matchingRound: { type: 'PLAN_DEVELOPER', phase: 'FIRST' },
        appliedMemberCount: '99',
        availableMemberCount: '99',
      },
    ],
    schoolApplicationStatistics: [
      {
        schoolId: '8',
        schoolName: '단국대학교',
        totalMemberCount: '3',
        rounds: [{ phase: 'FIRST', applicantCount: '3' }],
      },
    ],
    projectRoundStatistics: [
      {
        projectId: '88',
        projectName: 'East of Eden',
        rounds: [{ phase: 'FIRST', applicantCount: '6' }],
      },
    ],
  },
};

describe('getCurrentRound', () => {
  it('서버가 알려 준 지금 매칭 종류 · 차수', () => {
    expect(getCurrentRound(statistics)).toEqual({ type: 'PLAN_DESIGN', round: 1 });
  });

  it('진행 중인 차수가 없으면 null', () => {
    expect(getCurrentRound({ matchingRound: null })).toBeNull();
  });
});

describe('toRoundProgress', () => {
  it('고른 매칭 종류만 골라 카드 계산 결과와 같게 바꾼다', () => {
    const progress = toRoundProgress(statistics, 'PLAN_DESIGN', 1);

    expect(getRoundApplicationStats(progress)).toEqual([
      { round: 1, applied: 15, eligible: 15 },
      { round: 2, applied: null, eligible: null },
      { round: 3, applied: null, eligible: null },
    ]);
    expect(getCurrentRoundSummary(progress)).toEqual({
      appliedCount: 15,
      notAppliedCount: 0,
      rate: 100,
    });
  });
});

describe('toProjectApplications', () => {
  it('응답의 프로젝트 이름과 차수별 지원자 수', () => {
    expect(toProjectApplications(statistics)).toEqual([
      { projectName: 'East of Eden', counts: { 1: 6, 2: 0, 3: 0 } },
    ]);
  });
});

describe('toTotalApplicants', () => {
  it('학교별 현재 차수 지원 인원 / 지원 가능 인원', () => {
    expect(getSchoolApplicantStats(toTotalApplicants(statistics, 1))).toEqual({
      totalCount: 3,
      schools: [{ schoolName: '단국대학교', applied: 3, eligible: 3 }],
      hasApplicants: true,
    });
  });
});
