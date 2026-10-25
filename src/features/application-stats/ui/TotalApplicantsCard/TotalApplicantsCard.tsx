import CountBreakdownCard from '@/shared/ui/CountBreakdownCard';

import { getSchoolApplicantStats } from '../../model/getSchoolApplicantStats';
import type { TotalApplicants } from '../../model/types';
import personGraphic from './assets/person.png';

// 총원 카드 (피그마 Count Breakdown Card · 지원자): 총원 + 학교별 "실제 지원 인원 / 현재 차수 지원 가능 인원"
const TotalApplicantsCard = (totalApplicants: TotalApplicants) => {
  const { totalCount, schools, hasApplicants } = getSchoolApplicantStats(totalApplicants);

  return (
    <CountBreakdownCard
      icon={
        <span
          aria-hidden
          className="size-[30px] shrink-0 bg-current mask-alpha mask-size-[36px_36px] mask-no-repeat"
          style={{ maskImage: `url(${personGraphic})` }}
        />
      }
      title="총원"
      totalCount={totalCount}
      rows={schools.map(({ schoolName, applied, eligible }) => ({
        label: schoolName,
        value: applied,
        max: eligible,
      }))}
      isEmpty={!hasApplicants}
      emptyMessage={
        <>
          아직 지원한
          <br />
          챌린저가 없어요
        </>
      }
      className="px-8"
    />
  );
};

export default TotalApplicantsCard;
