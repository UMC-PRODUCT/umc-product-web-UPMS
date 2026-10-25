import { UPDATED_AT_CAPTION } from './constants';

// 섹션 제목(SectionHeader slot) 오른쪽 "기준 시각" 캡션
// TODO: 집계 시각 API 연동
const UpdatedAtCaption = () => (
  <span className="flex w-[200px] items-center justify-center text-body-3-regular whitespace-nowrap text-teal-grey-600">
    {UPDATED_AT_CAPTION}
  </span>
);

export default UpdatedAtCaption;
