import { SchoolPictogram } from '@umc-product/icons';

import CountBreakdownCard from '@/shared/ui/CountBreakdownCard';

import type { SchoolMatching } from '../../model/types';

type SchoolMatchingCardProps = {
  schools: SchoolMatching[];
};

// 학교별 매칭 현황 카드 (피그마 Count Breakdown Card · 매칭자): 전체 인원 + 학교별 "매칭 인원 / 전체 인원"
const SchoolMatchingCard = ({ schools }: SchoolMatchingCardProps) => (
  <CountBreakdownCard
    icon={<SchoolPictogram size={32} className="shrink-0" />}
    title="학교별 매칭 현황"
    totalCount={schools.reduce((sum, { total }) => sum + total, 0)}
    rows={schools.map(({ schoolName, matched, total }) => ({
      label: schoolName,
      value: matched,
      max: total,
    }))}
    isEmpty={!schools.some(({ matched }) => (matched ?? 0) > 0)}
    emptyMessage={
      <>
        아직 매칭 완료된
        <br />
        챌린저가 없어요.
      </>
    }
  />
);

export default SchoolMatchingCard;
