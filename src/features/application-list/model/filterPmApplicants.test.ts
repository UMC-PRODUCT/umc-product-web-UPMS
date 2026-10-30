import { INITIAL_APPLICATION_FILTERS } from './filterOptions';
import { filterPmApplicants, getApplicantSchoolOptions } from './filterPmApplicants';
import type { Applicant } from './types';

const applicant = (overrides: Partial<Applicant>): Applicant => ({
  applicantId: '1',
  applicationId: 1,
  matchingRoundId: 11,
  memberId: 501,
  round: 1,
  part: 'design',
  challengerName: '로미/신지혜',
  schoolName: '한국대',
  status: 'WAITING',
  appliedAt: '2026-10-01T10:00:00+09:00',
  processedAt: null,
  ...overrides,
});

const applicants = [
  applicant({ applicantId: '1' }),
  applicant({ applicantId: '2', challengerName: '하늘/박경운', schoolName: '중앙대', round: 2 }),
  applicant({ applicantId: '3', part: 'web-pe', schoolName: '가톨릭대', round: 2 }),
];

const ids = (list: Applicant[]) => list.map(({ applicantId }) => applicantId);

describe('filterPmApplicants', () => {
  it('필터가 비어 있으면 전체', () => {
    expect(ids(filterPmApplicants(applicants, '', INITIAL_APPLICATION_FILTERS))).toEqual([
      '1',
      '2',
      '3',
    ]);
  });

  it('닉네임/이름 검색과 학교 · 파트 · 차수 필터를 모두 적용한다', () => {
    expect(ids(filterPmApplicants(applicants, ' 하늘 ', INITIAL_APPLICATION_FILTERS))).toEqual([
      '2',
    ]);
    expect(
      ids(
        filterPmApplicants(applicants, '', {
          school: ['가톨릭대', '중앙대'],
          part: ['Web'],
          round: ['2'],
        }),
      ),
    ).toEqual(['3']);
  });
});

describe('getApplicantSchoolOptions', () => {
  it('지원자 학교를 중복 없이 가나다순으로', () => {
    expect(getApplicantSchoolOptions(applicants).map(({ value }) => value)).toEqual([
      '가톨릭대',
      '중앙대',
      '한국대',
    ]);
  });
});
