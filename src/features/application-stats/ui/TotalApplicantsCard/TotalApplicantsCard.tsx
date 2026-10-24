import { getSchoolApplicantStats } from '../../model/getSchoolApplicantStats';
import type { TotalApplicants } from '../../model/types';
import EmptyApplicants from './EmptyApplicants';
import SchoolApplicantList from './SchoolApplicantList';
import TotalApplicantsHeader from './TotalApplicantsHeader';

// 총원 카드: 총원 + 학교별 지원 인원 (현재 차수에 지원자가 없으면 안내 문구)
const TotalApplicantsCard = (totalApplicants: TotalApplicants) => {
  const { totalCount, schools, hasApplicants } = getSchoolApplicantStats(totalApplicants);

  return (
    <div className="flex h-[300px] w-full min-w-[260px] flex-col rounded-xl border border-teal-grey-100 bg-white px-7 pt-6 pb-8 shadow-drop-neutral-3">
      <TotalApplicantsHeader totalCount={totalCount} />
      {hasApplicants ? (
        <div className="mt-12 flex min-h-0 flex-1">
          <SchoolApplicantList schools={schools} />
        </div>
      ) : (
        <div className="mt-8 flex min-h-0 flex-1 items-center justify-center">
          <EmptyApplicants />
        </div>
      )}
    </div>
  );
};

export default TotalApplicantsCard;
