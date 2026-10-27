import DateTimeField from '@/shared/ui/DateTimeField';

import { formatDateDigits } from '../model/scheduleFormat';
import ScheduleFieldRow from './ScheduleFieldRow';

type OverallScheduleFieldProps = {
  startDate: string;
  onStartDateChange?: (value: string) => void; // 없으면 수정 불가 (1차 매칭 시작 뒤 · 조회만 하는 역할)
  endDate: string | null; // 시작일로 자동 계산한 종료일
  invalid?: boolean;
  onDisabledClick?: () => void; // 자동 계산 칸 · 수정할 수 없는 칸을 눌렀을 때
};

// 피그마 기본 매칭 일정 '전체 매칭 일정': 시작일만 입력, 종료일은 자동 계산
const OverallScheduleField = ({
  startDate,
  onStartDateChange,
  endDate,
  invalid = false,
  onDisabledClick,
}: OverallScheduleFieldProps) => (
  <ScheduleFieldRow label="전체 매칭 일정">
    <div className="flex flex-wrap items-center gap-2">
      <DateTimeField
        type="date"
        prefix="시작"
        aria-label="전체 매칭 시작일"
        value={startDate}
        onValueChange={onStartDateChange}
        formatValue={formatDateDigits}
        invalid={invalid}
        onDisabledClick={onDisabledClick}
      />
      <span aria-hidden className="w-[9px] text-center text-body-3-medium text-teal-grey-400">
        ~
      </span>
      <DateTimeField
        type="date"
        prefix="종료"
        aria-label="전체 매칭 종료일"
        value={endDate ?? ''}
        onDisabledClick={onDisabledClick}
      />
    </div>
  </ScheduleFieldRow>
);

export default OverallScheduleField;
