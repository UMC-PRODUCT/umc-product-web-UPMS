import { GuidanceMessage } from '@umc-product/react';

import DateTimeField from '@/shared/ui/DateTimeField';

import { formatTimeDigits } from '../model/scheduleFormat';
import ScheduleFieldRow from './ScheduleFieldRow';

type AnnouncementTimeFieldProps = {
  value: string;
  onValueChange?: (value: string) => void; // 없으면 수정 불가
  invalid?: boolean;
};

// 피그마 기본 매칭 일정 '매칭 결과발표': 차수마다 매칭 기간이 끝나는 날의 공통 발표 시각
const AnnouncementTimeField = ({
  value,
  onValueChange,
  invalid = false,
}: AnnouncementTimeFieldProps) => (
  <ScheduleFieldRow label="매칭 결과발표">
    <div className="flex flex-col items-start gap-2">
      <DateTimeField
        type="time"
        aria-label="매칭 결과 발표 시각"
        value={value}
        onValueChange={onValueChange}
        formatValue={formatTimeDigits}
        invalid={invalid}
      />
      <GuidanceMessage showIcon={false}>차수별 매칭 결과가 발표되는 시간이에요</GuidanceMessage>
    </div>
  </ScheduleFieldRow>
);

export default AnnouncementTimeField;
