import { UPDATED_AT_CAPTION } from './constants';

const pad = (value: number) => String(value).padStart(2, '0');

// 피그마 형식: "26.10.28 14:30 기준"
const formatUpdatedAt = (time: number) => {
  const date = new Date(time);
  const day = `${pad(date.getFullYear() % 100)}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())} 기준`;
};

type UpdatedAtCaptionProps = {
  // 데이터를 서버에서 받아 온 시각 (TanStack Query dataUpdatedAt, ms). 0이면 아직 받기 전이라 비움
  // 넘기지 않으면 고정 문구 (아직 API를 연동하지 않은 화면)
  updatedAt?: number;
};

// 섹션 제목(SectionHeader slot) 오른쪽 "기준 시각" 캡션. 시각은 오른쪽 끝에 붙임
const UpdatedAtCaption = ({ updatedAt }: UpdatedAtCaptionProps) => (
  <span className="flex w-[200px] items-center justify-end text-body-3-regular whitespace-nowrap text-teal-grey-600">
    {updatedAt === undefined ? UPDATED_AT_CAPTION : updatedAt > 0 && formatUpdatedAt(updatedAt)}
  </span>
);

export default UpdatedAtCaption;
