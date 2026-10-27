import type { SelectOption } from '@umc-product/react';

import { MOCK_CHAPTERS } from '@/entities/chapter';

import type { ProjectFilterKey, ProjectFilterValues } from './types';

const byKoreanName = (a: string, b: string) => a.localeCompare(b, 'ko');
const toOptions = (labels: string[]): SelectOption[] =>
  labels.map((label) => ({ value: label, label }));

export const INITIAL_PROJECT_FILTERS: ProjectFilterValues = {
  chapter: [],
  school: [],
  part: [],
  recruitStatus: [],
};

// 지부를 고르면 그 지부 학교만, 안 고르면 전체 학교
export const getSchoolOptions = (chapterIds: string[]): SelectOption[] =>
  toOptions(
    MOCK_CHAPTERS.filter(({ id }) => chapterIds.length === 0 || chapterIds.includes(id))
      .flatMap(({ schools }) => schools)
      .sort(byKoreanName),
  );

// 피그마 "메뉴 드롭다운 케이스 정리" 기준: 지부 · 모집 상태는 단일, PM 학교 · 파트는 다중 선택
// TODO: 지부 · 학교 목록 API 연동
export const PROJECT_FILTERS: {
  key: ProjectFilterKey;
  label: string;
  options: SelectOption[];
  multiple?: boolean;
}[] = [
  {
    key: 'chapter',
    label: '지부',
    options: [...MOCK_CHAPTERS]
      .sort((a, b) => byKoreanName(a.name, b.name))
      .map(({ id, name }) => ({ value: id, label: name })),
  },
  { key: 'school', label: 'PM 학교', multiple: true, options: getSchoolOptions([]) },
  { key: 'part', label: '파트', multiple: true, options: toOptions(['Web', 'Mobile']) },
  {
    key: 'recruitStatus',
    label: '모집 상태',
    options: [
      { value: 'RECRUITING', label: '모집 중' },
      { value: 'CLOSED', label: '모집 완료' },
    ],
  },
];
