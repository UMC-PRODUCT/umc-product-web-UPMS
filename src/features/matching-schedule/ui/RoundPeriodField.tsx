import { InfoIcon } from '@umc-product/icons';
import { GuidanceMessage } from '@umc-product/react';
import type { ReactNode } from 'react';

import DateTimeField from '@/shared/ui/DateTimeField';

import type { SchedulePeriod } from '../model/types';

type RoundPeriodFieldProps = {
  title: string; // 예: 1차 지원 기간, 랜덤 매칭 기간
  period: SchedulePeriod | null; // 전체 매칭 시작일로 자동 계산, 시작일 입력 전이면 null
  guidance?: ReactNode; // 아래 안내 문구 (info 아이콘과 함께)
  onDisabledClick?: () => void; // 자동 입력 칸을 눌렀을 때
  endPlaceholder?: string; // 시작일 입력 전 종료 시각 자리 (피그마: 23:59, 랜덤 매칭 20:00)
};

const DAY_START_PLACEHOLDER = '00:00';

// 피그마 차수별 일정 설정의 N차 · 랜덤 지원 기간: 시작일 · 시작 시각 ~ 종료 시각 (모두 자동 입력)
const RoundPeriodField = ({
  title,
  period,
  guidance,
  onDisabledClick,
  endPlaceholder = '23:59',
}: RoundPeriodFieldProps) => (
  <div className="flex flex-col items-start gap-2">
    <p className="text-title-3-medium font-semibold text-teal-600">{title}</p>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <DateTimeField
          type="date"
          prefix="시작"
          aria-label={`${title} 시작일`}
          value={period?.start.date ?? ''}
          onDisabledClick={onDisabledClick}
        />
        <DateTimeField
          type="time"
          aria-label={`${title} 시작 시각`}
          value={period?.start.time ?? ''}
          placeholder={DAY_START_PLACEHOLDER}
          onDisabledClick={onDisabledClick}
        />
      </div>
      <span aria-hidden className="w-[9px] text-center text-body-3-medium text-teal-grey-400">
        ~
      </span>
      {/* 종료일은 다음 차수 시작 전날이라 시각만 보여 줌 */}
      <DateTimeField
        type="time"
        aria-label={`${title} 종료 시각`}
        value={period?.end.time ?? ''}
        placeholder={endPlaceholder}
        onDisabledClick={onDisabledClick}
      />
    </div>
    {guidance && (
      // 디자인 시스템 안내 문구 아이콘은 체크로 고정이라 info 아이콘을 따로 붙임
      <div className="flex items-center gap-1 text-teal-grey-500">
        <InfoIcon size={16} aria-hidden />
        <GuidanceMessage showIcon={false}>{guidance}</GuidanceMessage>
      </div>
    )}
  </div>
);

export default RoundPeriodField;
