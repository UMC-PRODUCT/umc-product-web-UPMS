import { describe, expect, it } from 'vitest';

import { getSchoolApplicantStats } from './getSchoolApplicantStats';

describe('getSchoolApplicantStats', () => {
  it('학교별로 이전 차수 매칭 인원을 뺀 지원 가능 인원을 구한다', () => {
    const { schools, totalCount } = getSchoolApplicantStats({
      currentRound: 2,
      schools: [
        {
          schoolName: 'A대',
          eligibleCount: 30,
          rounds: [
            { round: 1, applied: 10, matched: 10 },
            { round: 2, applied: 5, matched: null },
          ],
        },
        {
          schoolName: 'B대',
          eligibleCount: 20,
          rounds: [
            { round: 1, applied: 4, matched: 2 },
            { round: 2, applied: 6, matched: null },
          ],
        },
      ],
    });

    expect(schools).toEqual([
      { schoolName: 'A대', applied: 5, eligible: 20 },
      { schoolName: 'B대', applied: 6, eligible: 18 },
    ]);
    expect(totalCount).toBe(38);
  });

  it('1차에는 학교 전체 인원이 지원 가능 인원이다', () => {
    const { schools } = getSchoolApplicantStats({
      currentRound: 1,
      schools: [
        {
          schoolName: 'A대',
          eligibleCount: 30,
          rounds: [{ round: 1, applied: 12, matched: null }],
        },
      ],
    });
    expect(schools[0]).toEqual({ schoolName: 'A대', applied: 12, eligible: 30 });
  });

  it('현재 차수에 지원자가 아무도 없으면 hasApplicants는 false', () => {
    const { hasApplicants } = getSchoolApplicantStats({
      currentRound: 1,
      schools: [
        { schoolName: 'A대', eligibleCount: 30, rounds: [{ round: 1, applied: 0, matched: null }] },
      ],
    });
    expect(hasApplicants).toBe(false);
  });
});
