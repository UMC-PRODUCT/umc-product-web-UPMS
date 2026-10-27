import type { ReactNode } from 'react';

type ScheduleFieldRowProps = {
  label: string;
  align?: 'center' | 'start'; // start: 아래에 안내 문구가 붙는 칸 (라벨을 입력 칸 높이에 맞춤)
  children: ReactNode;
};

// 피그마 기본 매칭 일정 한 줄: 90px 라벨 + 입력 영역
const ScheduleFieldRow = ({ label, align = 'start', children }: ScheduleFieldRowProps) => (
  // 좁은 화면에서는 입력 영역을 라벨 아래로 내림
  <div
    className={`flex flex-wrap gap-x-6 gap-y-2 ${align === 'center' ? 'items-center' : 'items-start'}`}
  >
    <p
      className={`flex w-[90px] shrink-0 items-center text-body-1-regular text-teal-grey-800 ${
        align === 'start' ? 'h-11' : ''
      }`}
    >
      {label}
    </p>
    {children}
  </div>
);

export default ScheduleFieldRow;
