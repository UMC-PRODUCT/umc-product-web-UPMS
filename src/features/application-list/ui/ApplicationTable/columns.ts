import type { RecruitPart } from '../../model/types';

// 헤더와 행이 같은 열 너비를 쓰도록 모아둠
// 피그마 폭을 기본으로 화면 폭에 맞춰 같은 비율로 늘고 줄며, 글자가 잘리지 않는 최소 폭까지만 줄어듦
// (패딩이 달라도 헤더 · 행 열이 맞도록 basis에 고정 폭을 씀)
export const COLUMN_CLASS = {
  project: 'flex-[1_1_184px] min-w-[120px] pr-4',
  part: 'flex-[1_1_122px] min-w-[80px]',
  challenger: 'flex-[1_1_200px] min-w-[140px]',
  status: 'flex-[1_1_136px] min-w-[104px]',
} as const;

// 모집 파트 열 묶음 (열 사이 2px)
export const RECRUIT_GROUP_CLASS = 'flex flex-[1_1_320px] min-w-[292px] items-center gap-0.5';

export const RECRUIT_COLUMNS: { part: RecruitPart; label: string; width: string }[] = [
  { part: 'DESIGN', label: 'Design 지원', width: 'flex-[1_1_104px] min-w-24' },
  { part: 'WEB_PE', label: 'Web PE 지원', width: 'flex-[1_1_105px] min-w-24' },
  { part: 'MOBILE_PE', label: 'Mobile PE 지원', width: 'flex-[1_1_107px] min-w-24' },
];

// 이보다 좁으면 표 전체를 가로로 스크롤 (지원자 줄의 최소 폭 기준)
export const TABLE_MIN_WIDTH_CLASS = 'min-w-[860px]';
