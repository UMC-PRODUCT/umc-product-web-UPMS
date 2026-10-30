import type { SelectOption } from '@umc-product/react';

import type { ApplicationFilterKey, ApplicationFilterValues } from './types';

const toOptions = (labels: string[]): SelectOption[] =>
  labels.map((label) => ({ value: label, label }));

// 빈 배열 = 선택 없음 (전체 내역)
export const INITIAL_APPLICATION_FILTERS: ApplicationFilterValues = {
  school: [],
  part: [],
  round: [],
  recruitStatus: [],
};

// 피그마 "메뉴 드롭다운 케이스 정리" 기준
// 학교 보기는 화면마다 달라서(어드민: 고른 지부 소속 학교, PM: 지원자들의 학교) 화면에서 채움
export const APPLICATION_FILTERS: {
  key: ApplicationFilterKey;
  label: string;
  options: SelectOption[];
  multiple?: boolean;
}[] = [
  {
    key: 'school',
    label: '학교',
    multiple: true,
    options: [],
  },
  {
    key: 'part',
    label: '파트',
    multiple: true,
    options: toOptions(['Web', 'Mobile']),
  },
  {
    key: 'recruitStatus',
    label: '모집 상태',
    options: [
      { value: 'RECRUITING', label: '모집 중' },
      { value: 'CLOSED', label: '모집 완료' },
    ],
  },
  {
    key: 'round',
    label: '차수',
    multiple: true,
    options: [
      { value: '1', label: '1차' },
      { value: '2', label: '2차' },
      { value: '3', label: '3차' },
    ],
  },
];
