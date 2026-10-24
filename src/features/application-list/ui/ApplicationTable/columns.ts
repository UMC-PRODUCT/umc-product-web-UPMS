import type { RecruitPart } from '../../model/types';

// 헤더와 행이 같은 열 너비를 쓰도록 피그마 기준 값을 모아둠
export const COLUMN_CLASS = {
  project: 'w-[184px] pr-4',
  part: 'w-[122px]',
  challenger: 'w-[200px]',
  status: 'w-[136px]',
} as const;

export const RECRUIT_COLUMNS: { part: RecruitPart; label: string; width: string }[] = [
  { part: 'DESIGN', label: 'Design 지원', width: 'w-[104px]' },
  { part: 'WEB_PE', label: 'Web PE 지원', width: 'w-[105px]' },
  { part: 'MOBILE_PE', label: 'Mobile PE 지원', width: 'w-[107px]' },
];
