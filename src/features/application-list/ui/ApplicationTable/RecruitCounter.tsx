import type { PartRecruitment } from '../../model/types';

type RecruitCounterProps = {
  recruitment: PartRecruitment | null; // 모집하지 않는 파트면 null
};

// 지원 인원 / 모집 인원. 모집하지 않는 파트는 빈칸
const RecruitCounter = ({ recruitment }: RecruitCounterProps) => {
  if (!recruitment) return null;

  return (
    <p className="flex items-center gap-0.5 text-body-1-medium">
      <span className="min-w-2.5 text-center font-semibold text-teal-600">
        {recruitment.applied}
      </span>
      <span className="w-[5px] text-right text-teal-grey-500">/</span>
      <span className="min-w-2.5 text-center text-teal-grey-500">{recruitment.capacity}</span>
    </p>
  );
};

export default RecruitCounter;
