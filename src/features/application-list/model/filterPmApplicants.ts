import type { PartTagPart } from '@umc-product/react';

import type { Applicant, ApplicationFilterValues } from './types';

// 파트 필터(Web · Mobile) → 지원자 파트 태그
const PART_TAG: Record<string, PartTagPart> = {
  Web: 'web-pe',
  Mobile: 'mobile-pe',
};

const includes = (selected: string[], value: string) =>
  selected.length === 0 || selected.includes(value);

// PM 지원자 목록 검색 · 필터 (빈 필터 = 전체)
// 검색어는 닉네임/이름, 학교 필터 값은 학교 이름, 차수 필터 값은 '1' · '2' · '3'
export const filterPmApplicants = (
  applicants: Applicant[],
  keyword: string,
  { school, part, round }: Pick<ApplicationFilterValues, 'school' | 'part' | 'round'>,
) => {
  const trimmed = keyword.trim().toLowerCase();
  const parts = part.flatMap((value) => PART_TAG[value] ?? []);

  return applicants.filter(
    (applicant) =>
      applicant.challengerName.toLowerCase().includes(trimmed) &&
      includes(school, applicant.schoolName) &&
      (parts.length === 0 || parts.includes(applicant.part)) &&
      includes(round, String(applicant.round)),
  );
};

// 학교 필터 보기: 지원자들의 학교 (가나다순)
export const getApplicantSchoolOptions = (applicants: Applicant[]) =>
  [...new Set(applicants.map(({ schoolName }) => schoolName).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'ko'))
    .map((schoolName) => ({ value: schoolName, label: schoolName }));
