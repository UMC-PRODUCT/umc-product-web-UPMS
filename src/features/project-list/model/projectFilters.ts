import type { SelectOption } from '@umc-product/react';

import type { ChapterSummary } from '@/entities/chapter';

import type { ProjectFilterKey, ProjectFilterValues } from './types';

const byKoreanName = (a: string, b: string) => a.localeCompare(b, 'ko');

export const INITIAL_PROJECT_FILTERS: ProjectFilterValues = {
  chapter: [],
  school: [],
  part: [],
  recruitStatus: [],
};

export type ProjectFilter = {
  key: ProjectFilterKey;
  label: string;
  options: SelectOption[];
  multiple?: boolean;
};

// 피그마 "메뉴 드롭다운 케이스 정리" 기준: 지부 · 모집 상태는 단일, PM 학교 · 파트는 다중 선택
// 지부 · 학교는 서버 ID를 값으로 씀 (쿼리로 그대로 보냄)
export const getProjectFilters = (
  chapters: ChapterSummary[],
  schoolOptions: SelectOption[],
): ProjectFilter[] => [
  {
    key: 'chapter',
    label: '지부',
    options: [...chapters]
      .sort((a, b) => byKoreanName(a.name, b.name))
      .map(({ id, name }) => ({ value: String(id), label: name })),
  },
  { key: 'school', label: 'PM 학교', multiple: true, options: schoolOptions },
  {
    key: 'part',
    label: '파트',
    multiple: true,
    options: ['Web', 'Mobile'].map((label) => ({ value: label, label })),
  },
  {
    key: 'recruitStatus',
    label: '모집 상태',
    options: [
      { value: 'RECRUITING', label: '모집 중' },
      { value: 'CLOSED', label: '모집 완료' },
    ],
  },
];
