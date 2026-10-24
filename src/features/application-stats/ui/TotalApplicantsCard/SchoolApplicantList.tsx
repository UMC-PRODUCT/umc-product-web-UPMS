import type { SchoolApplicantStat } from '../../model/types';

type SchoolApplicantListProps = {
  schools: SchoolApplicantStat[];
};

const formatCount = (count: number | null) => (count === null ? '- 명' : `${count}명`);

// 학교별 "실제 지원 인원 / 현재 차수 지원 가능 인원"
const SchoolApplicantList = ({ schools }: SchoolApplicantListProps) => (
  <ul className="flex w-full flex-col gap-3 overflow-y-auto">
    {schools.map(({ schoolName, applied, eligible }) => (
      <li key={schoolName} className="flex w-full items-center justify-between">
        <span className="text-body-2-medium whitespace-nowrap text-teal-grey-600">
          {schoolName}
        </span>
        <span className="flex items-center justify-end gap-1 text-right text-body-3-medium">
          <span className="min-w-[35px] whitespace-nowrap text-teal-500">
            {formatCount(applied)}
          </span>
          <span className="flex items-center justify-end gap-0.5 text-teal-grey-500">
            <span>/</span>
            <span className="min-w-[35px] whitespace-nowrap">{formatCount(eligible)}</span>
          </span>
        </span>
      </li>
    ))}
  </ul>
);

export default SchoolApplicantList;
