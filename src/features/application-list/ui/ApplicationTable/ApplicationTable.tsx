import { Fragment, useState } from 'react';

import type { View } from '@/entities/session';

import type { Applicant, ProjectApplicationGroup } from '../../model/types';
import ApplicantRow from './ApplicantRow';
import ApplicationTableHead from './ApplicationTableHead';
import ApplicationTableRow from './ApplicationTableRow';
import { TABLE_MIN_WIDTH_CLASS } from './columns';
import CoPmRow from './CoPmRow';

export type ApplicationTableView = Exclude<View, 'CHALLENGER'>;

// 권한별로 테이블에서 달라지는 부분
const VIEW_OPTIONS: Record<
  ApplicationTableView,
  { projectLinkable: boolean; expandable: boolean }
> = {
  // 어드민: 여러 프로젝트, 프로젝트 상세 이동 가능, 행을 눌러 펼치면 지원자 표시
  ADMIN: { projectLinkable: true, expandable: true },
  // PM: 내 프로젝트만, 프로젝트명 클릭 불가, 지원자 항상 표시
  PM_CHALLENGER: { projectLinkable: false, expandable: false },
};

type ApplicationTableProps = {
  view: ApplicationTableView;
  groups: ProjectApplicationGroup[]; // 현재 페이지 데이터 (피그마: 10개씩 페이지 구분)
  onProjectClick?: (group: ProjectApplicationGroup) => void; // 어드민: 프로젝트명 클릭
  onApplicantClick?: (group: ProjectApplicationGroup, applicant: Applicant) => void; // PM: 지원자 이름 클릭
  className?: string; // 스크롤 영역 폭 (화면에 보이는 폭으로 줄일 때)
  contentClassName?: string; // 표 자체의 최소 폭 (기본 860px, 이보다 좁으면 가로 스크롤)
};

// 지원 목록 공용 테이블: 프로젝트 줄 + (더블 PM 줄) + 지원자 줄들, 권한별로 보이는 내용이 다름
const ApplicationTable = ({
  view,
  groups,
  onProjectClick,
  onApplicantClick,
  className = '',
  contentClassName = TABLE_MIN_WIDTH_CLASS,
}: ApplicationTableProps) => {
  const { projectLinkable, expandable } = VIEW_OPTIONS[view];
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  return (
    // 열은 화면 폭에 맞춰 줄어들고, 최소 폭보다 좁으면 헤더 · 행이 같이 가로로 스크롤됨
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className={`flex w-full flex-col ${contentClassName}`}>
        <ApplicationTableHead />
        <ul className="flex w-full flex-col overflow-hidden rounded-b-xl border-x border-b border-teal-grey-100 pt-1">
          {groups.length === 0 && (
            // 피그마: 목록 영역 높이 204px (위 여백 4px 포함)
            <li className="flex h-[200px] items-center justify-center text-body-1-medium text-teal-grey-400">
              등록된 프로젝트와 지원자가 없어요
            </li>
          )}
          {groups.map((group) => {
            const { project, coPms, applicants } = group;
            const selected = expandable && selectedProjectId === project.projectId;
            const showDetails = !expandable || selected;

            return (
              <Fragment key={project.projectId}>
                <ApplicationTableRow
                  {...project}
                  projectLinkable={projectLinkable}
                  onProjectClick={onProjectClick && (() => onProjectClick(group))}
                  selected={selected}
                  // TODO: PM 뷰 화살표 버튼 동작 기획 확인
                  onToggle={
                    expandable
                      ? () =>
                          setSelectedProjectId((prev) =>
                            prev === project.projectId ? null : project.projectId,
                          )
                      : undefined
                  }
                />
                {showDetails &&
                  coPms.map((coPm) => (
                    <CoPmRow key={`${coPm.challengerName}-${coPm.schoolName}`} {...coPm} />
                  ))}
                {showDetails &&
                  applicants.map((applicant) => (
                    <ApplicantRow
                      key={applicant.applicantId}
                      {...applicant}
                      onApplicantClick={
                        onApplicantClick && (() => onApplicantClick(group, applicant))
                      }
                    />
                  ))}
                {showDetails && applicants.length === 0 && (
                  <li className="flex h-[68px] items-center justify-center border-b-2 border-teal-grey-100 text-body-3-medium text-teal-grey-500">
                    지원한 챌린저가 없어요
                  </li>
                )}
              </Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ApplicationTable;
