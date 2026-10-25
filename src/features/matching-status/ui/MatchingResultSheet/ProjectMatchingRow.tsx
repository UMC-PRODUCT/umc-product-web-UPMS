import { StatusTag } from '@umc-product/react';

import type { MatchedMember, PartMatching, ProjectMatchingResult } from '../../model/types';
import PartSlots from './PartSlots';

type ProjectMatchingRowProps = {
  project: ProjectMatchingResult;
  onMemberClick?: (
    project: ProjectMatchingResult,
    part: PartMatching,
    member: MatchedMember,
  ) => void;
  onEmptySlotClick?: (project: ProjectMatchingResult, part: PartMatching) => void;
};

// 매칭 결과 시트의 프로젝트 한 줄: 프로젝트명(+ 모집 중) · PM · 파트별 매칭 결과 칸 · 매칭 인원
const ProjectMatchingRow = ({
  project,
  onMemberClick,
  onEmptySlotClick,
}: ProjectMatchingRowProps) => {
  const { projectName, pmName, pmSchoolName, recruiting, parts } = project;
  const matchedCount = parts.reduce((sum, { members }) => sum + members.length, 0);
  const capacity = parts.reduce((sum, part) => sum + part.capacity, 0);

  return (
    <li className="flex w-full items-start justify-between bg-teal-grey-50 py-3 pr-7 pl-5">
      <div className="flex min-h-[50px] w-[170px] shrink-0 flex-col justify-center gap-1.5 px-2.5">
        <p className="truncate text-body-1-medium text-teal-grey-800">{projectName}</p>
        {/* 매칭 진행 중일 때만 모집 중 태그 */}
        {recruiting && (
          <StatusTag
            color="warning"
            className="text-label-6-medium [&>.umc-status-tag\_\_dot]:size-2"
          >
            모집 중
          </StatusTag>
        )}
      </div>
      <div className="flex h-[50px] w-[150px] shrink-0 flex-col justify-center gap-0.5 px-3.5 whitespace-nowrap">
        <p className="text-body-3-medium text-teal-grey-800">{pmName}</p>
        <p className="text-caption-3-regular text-teal-grey-500">{pmSchoolName}</p>
      </div>
      <div className="flex w-[688px] shrink-0 flex-col gap-px">
        {parts.map((part, index) => (
          <div key={part.partLabel} className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3.5">
              <p className="w-[58px] shrink-0 text-body-3-medium text-teal-900">{part.partLabel}</p>
              <PartSlots
                part={part}
                roundedClassName={index === 0 ? 'rounded-t-md' : 'rounded-tr-md'}
                onMemberClick={onMemberClick && ((member) => onMemberClick(project, part, member))}
                onEmptySlotClick={onEmptySlotClick && (() => onEmptySlotClick(project, part))}
              />
            </div>
            {/* 첫 줄 오른쪽: 매칭 진행 중이면 매칭 인원/모집 인원, 끝났으면 총 매칭 인원 */}
            {index === 0 && (
              <p className="text-body-1-semibold whitespace-nowrap text-teal-600">
                {recruiting ? `${matchedCount}/${capacity}명` : `총 ${matchedCount}명`}
              </p>
            )}
          </div>
        ))}
      </div>
    </li>
  );
};

export default ProjectMatchingRow;
