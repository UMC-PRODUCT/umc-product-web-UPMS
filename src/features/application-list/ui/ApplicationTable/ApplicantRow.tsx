import { PartTag, StatusTag } from '@umc-product/react';

import { APPLICANT_STATUS_TAG } from '../../model/applicantStatus';
import type { Applicant } from '../../model/types';

// "26-10-01 10:00" 형식
const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return {
    day: `${pad(date.getFullYear() % 100)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

// 시각 + "지원" / "처리" 라벨. 처리 전이면 "-"
const DateTimeCell = ({ iso, label }: { iso: string | null; label: string }) => {
  const formatted = iso ? formatDateTime(iso) : null;

  return (
    <div className="flex h-[50px] min-w-[150px] flex-[1_1_160px] items-center justify-center">
      <p className="flex items-center gap-1.5 text-body-3-regular whitespace-nowrap">
        {formatted ? (
          <span className="flex items-center gap-1 text-teal-grey-900">
            <span>{formatted.day}</span>
            <span>{formatted.time}</span>
          </span>
        ) : (
          <span className="text-teal-grey-900">-</span>
        )}
        <span className="text-teal-grey-600">{label}</span>
      </p>
    </div>
  );
};

type ApplicantRowProps = Applicant & {
  onApplicantClick?: () => void; // 챌린저 지원서 열기. 없으면 이름을 누를 수 없음
};

// 지원자 목록의 지원자 한 줄: 차수 · 파트 · 챌린저 · 상태 · 지원 시각 · 처리 시각
const ApplicantRow = ({
  round,
  part,
  challengerName,
  schoolName,
  status,
  appliedAt,
  processedAt,
  onApplicantClick,
}: ApplicantRowProps) => {
  const statusTag = APPLICANT_STATUS_TAG[status];
  const challenger = (
    <>
      <span className="text-body-3-medium text-teal-grey-800">{challengerName}</span>
      <span className="text-caption-3-regular text-teal-grey-500">{schoolName}</span>
    </>
  );

  // 피그마 지원자 목록 Table: 기본(흰 배경) / hover(회색 배경)
  // 열은 피그마 폭을 기본으로 화면 폭에 맞춰 같은 비율로 늘고 줄어듦
  return (
    <li className="flex h-[68px] w-full items-center border-b border-teal-grey-100/60 bg-white pr-16 pl-[120px] hover:bg-teal-grey-75">
      <p className="flex h-[50px] min-w-14 flex-[1_1_74px] items-center justify-center text-body-2-medium whitespace-nowrap text-teal-grey-800">
        {round}차
      </p>
      <div className="flex min-w-20 flex-[1_1_122px] px-2.5">
        <PartTag part={part} size="md" />
      </div>
      {onApplicantClick ? (
        <button
          type="button"
          onClick={onApplicantClick}
          className="flex h-[50px] min-w-[140px] flex-[1_1_200px] flex-col items-start justify-center gap-0.5 rounded-lg px-3.5 text-left whitespace-nowrap hover:bg-teal-grey-75"
        >
          {challenger}
        </button>
      ) : (
        <p className="flex min-w-[140px] flex-[1_1_200px] flex-col gap-0.5 px-3.5 whitespace-nowrap">
          {challenger}
        </p>
      )}
      <div className="flex min-w-24 flex-[1_1_136px] px-2.5">
        <StatusTag color={statusTag.color}>{statusTag.label}</StatusTag>
      </div>
      <DateTimeCell iso={appliedAt} label="지원" />
      <DateTimeCell iso={processedAt} label="처리" />
    </li>
  );
};

export default ApplicantRow;
