import type { Applicant, ApplicantStatus } from '../../model/types';
import ApplicantStatusChip from '../ApplicantStatusChip/ApplicantStatusChip';

// "04/22 00:00" 형식
const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return {
    day: `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

// 시각 + "지원" / "처리" 라벨. 처리 전이면 "-"
const DateTimeCell = ({ iso, label }: { iso: string | null; label: string }) => {
  const formatted = iso ? formatDateTime(iso) : null;

  return (
    <div className="flex h-[50px] w-[140px] items-center justify-center">
      <p className="flex items-center gap-1.5 text-body-3-regular whitespace-nowrap">
        <span className="flex items-center gap-1 text-teal-grey-900">
          {formatted ? (
            <>
              <span>{formatted.day}</span>
              <span>{formatted.time}</span>
            </>
          ) : (
            '-'
          )}
        </span>
        <span className="text-teal-grey-600">{label}</span>
      </p>
    </div>
  );
};

type ApplicantDetailRowProps = {
  applicant: Applicant;
  onStatusChange?: (status: ApplicantStatus) => void; // 없으면 누를 수 없는 칩 (Disabled)
  onApplicantClick?: () => void; // 챌린저 지원서 열기. 없으면 이름을 누를 수 없음
};

// 피그마 지원자 목록 상세 시트: 챌린저(지원서 이동) · 차수 · 배정 상태 칩 · 지원 시각 · 처리 시각
const ApplicantDetailRow = ({
  applicant,
  onStatusChange,
  onApplicantClick,
}: ApplicantDetailRowProps) => {
  const { challengerName, schoolName, round, status, appliedAt, processedAt } = applicant;

  return (
    <li className="flex h-[60px] w-full items-center justify-between border-b border-teal-grey-100/60 bg-white">
      {onApplicantClick ? (
        <button
          type="button"
          onClick={onApplicantClick}
          className="flex h-[50px] w-[150px] shrink-0 flex-col items-start justify-center gap-0.5 rounded-lg px-3.5 text-left whitespace-nowrap hover:bg-teal-grey-75"
        >
          <span className="text-body-3-medium text-teal-grey-800">{challengerName}</span>
          <span className="text-caption-3-regular text-teal-grey-500">{schoolName}</span>
        </button>
      ) : (
        // 지원서를 열 수 없는 역할(중앙운영진)은 이름만 표시
        <p className="flex h-[50px] w-[150px] shrink-0 flex-col justify-center gap-0.5 px-3.5 whitespace-nowrap">
          <span className="text-body-3-medium text-teal-grey-800">{challengerName}</span>
          <span className="text-caption-3-regular text-teal-grey-500">{schoolName}</span>
        </p>
      )}
      <div className="flex items-center">
        <p className="w-[38px] text-center text-body-3-medium text-teal-grey-800">{round}차</p>
        <div className="flex h-[50px] w-[100px] items-center px-2.5">
          <ApplicantStatusChip status={status} onStatusChange={onStatusChange} />
        </div>
      </div>
      <DateTimeCell iso={appliedAt} label="지원" />
      <DateTimeCell iso={processedAt} label="처리" />
    </li>
  );
};

export default ApplicantDetailRow;
