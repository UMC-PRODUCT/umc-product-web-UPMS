import type { SelectOption } from '@umc-product/react';

import { MOCK_CHAPTERS } from '@/entities/chapter';

import type { ApplicationFilterKey, ApplicationFilterValues } from './types';

const byKoreanName = (a: string, b: string) => a.localeCompare(b, 'ko');
const toOptions = (labels: string[]): SelectOption[] =>
  labels.map((label) => ({ value: label, label }));

// 빈 배열 = 선택 없음 (전체 내역)
export const INITIAL_APPLICATION_FILTERS: ApplicationFilterValues = {
  chapter: [],
  school: [],
  part: [],
  round: [],
  recruitStatus: [],
  applyStatus: [],
};

// 피그마 "메뉴 드롭다운 케이스 정리" 기준
// TODO: 지부·학교 목록 API 연동, 지원 상태 값 기획 확인 (케이스 정리에 없음)
export const APPLICATION_FILTERS: {
  key: ApplicationFilterKey;
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
  {
    key: 'school',
    label: '학교',
    multiple: true,
    // UI 표기는 "~학교" 없이 (예: 가톨릭대)
    options: toOptions(MOCK_CHAPTERS.flatMap(({ schools }) => schools).sort(byKoreanName)),
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
  {
    key: 'applyStatus',
    label: '지원 상태',
    options: [
      { value: 'APPLIED', label: '지원 완료' },
      { value: 'NOT_APPLIED', label: '지원 전' },
    ],
  },
];
