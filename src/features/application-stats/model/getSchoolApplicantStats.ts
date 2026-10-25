import { getRoundApplicationStats } from './getRoundApplicationStats';
import type { SchoolApplicantStat, TotalApplicants } from './types';

// 학교별로 현재 차수의 "실제 지원 인원 / 지원 가능 인원"을 구하고, 총원은 학교별 지원 가능 인원의 합
export const getSchoolApplicantStats = ({ currentRound, schools }: TotalApplicants) => {
  const stats: SchoolApplicantStat[] = schools.map(({ schoolName, eligibleCount, rounds }) => {
    const current = getRoundApplicationStats({ eligibleCount, rounds }).find(
      ({ round }) => round === currentRound,
    );
    return {
      schoolName,
      applied: current?.applied ?? null,
      eligible: current?.eligible ?? null,
    };
  });

  return {
    totalCount: stats.reduce((sum, { eligible }) => sum + (eligible ?? 0), 0),
    schools: stats,
    hasApplicants: stats.some(({ applied }) => (applied ?? 0) > 0),
  };
};
