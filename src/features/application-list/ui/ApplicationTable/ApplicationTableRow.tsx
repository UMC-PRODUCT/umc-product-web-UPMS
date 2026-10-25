import { ExpandLessIcon, ExpandMoreIcon } from '@umc-product/icons';
import { PartTag, Tag } from '@umc-product/react';

import type { ProjectApplicationRow, RecruitStatus } from '../../model/types';
import openNewIcon from './assets/open-new.svg';
import { COLUMN_CLASS, RECRUIT_COLUMNS } from './columns';
import RecruitCounter from './RecruitCounter';

const RECRUIT_STATUS_TAG: Record<RecruitStatus, { label: string; color: 'brand' | 'neutral' }> = {
  RECRUITING: { label: '모집 중', color: 'brand' },
  CLOSED: { label: '모집 완료', color: 'neutral' },
};

// 피그마 행 상태: 기본(흰 배경) / hover(회색 배경) / 선택(연한 teal 배경, 구분선 없음)
const ROW_STATE_CLASS = {
  default: 'border-b border-teal-grey-100/50 bg-white hover:bg-teal-grey-75',
  selected: 'bg-teal-50',
};

type ApplicationTableRowProps = ProjectApplicationRow & {
  selected?: boolean;
  onToggle?: () => void; // 없으면 행 선택 불가 (PM 뷰)
  projectLinkable?: boolean; // PM 뷰는 프로젝트명 클릭 불가 + 아이콘 없음
  onProjectClick?: () => void; // 프로젝트명을 누르면 프로젝트 상세 모달 열기
};

// 지원 목록 테이블의 프로젝트 한 줄. 행을 누르면 선택(펼침) 상태가 토글됨
const ApplicationTableRow = ({
  projectName,
  part,
  challengerName,
  schoolName,
  recruitStatus,
  recruitments,
  selected = false,
  onToggle,
  projectLinkable = true,
  onProjectClick,
}: ApplicationTableRowProps) => {
  const statusTag = RECRUIT_STATUS_TAG[recruitStatus];
  const ToggleIcon = selected ? ExpandLessIcon : ExpandMoreIcon;

  return (
    <li
      onClick={onToggle}
      className={`group flex h-[68px] w-full items-center gap-3 pr-[22px] pl-2.5 ${
        onToggle ? 'cursor-pointer' : ''
      } ${selected ? ROW_STATE_CLASS.selected : ROW_STATE_CLASS.default}`}
    >
      <div className="flex items-center">
        <div className={COLUMN_CLASS.project}>
          {projectLinkable ? (
            <button
              type="button"
              // 프로젝트 상세는 행 선택과 별개
              onClick={(event) => {
                event.stopPropagation();
                onProjectClick?.();
              }}
              // 피그마 프로젝트 이동 Button: 선택(펼친) 행에서는 hover 배경이 연한 teal
              className={`flex h-[50px] w-full items-center gap-1.5 rounded-lg px-2.5 text-left ${
                selected ? 'hover:bg-teal-100/80' : 'hover:bg-teal-grey-75'
              }`}
            >
              <img src={openNewIcon} alt="" width={20} height={20} className="shrink-0" />
              <span className="truncate text-body-1-medium text-teal-grey-800">{projectName}</span>
            </button>
          ) : (
            <p className="flex h-[50px] w-full items-center px-2.5">
              <span className="truncate text-body-1-medium text-teal-grey-800">{projectName}</span>
            </p>
          )}
        </div>
        <div className={`px-2.5 ${COLUMN_CLASS.part}`}>
          <PartTag part={part} size="md" />
        </div>
        <div className={`flex flex-col gap-1 px-4 whitespace-nowrap ${COLUMN_CLASS.challenger}`}>
          <p className="text-body-3-medium text-teal-grey-800">{challengerName}</p>
          <p className="text-caption-3-regular text-teal-grey-500">{schoolName}</p>
        </div>
        <div className={`px-2.5 ${COLUMN_CLASS.status}`}>
          <Tag variant="weak" color={statusTag.color} size="md">
            {statusTag.label}
          </Tag>
        </div>
        <div className="flex items-center gap-0.5">
          {RECRUIT_COLUMNS.map(({ part: recruitPart, width }) => (
            <div key={recruitPart} className={`flex h-[50px] justify-center ${width}`}>
              <div className="flex items-center">
                <RecruitCounter recruitment={recruitments[recruitPart]} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* TODO: 펼쳤을 때 보여줄 내용 기획 확인 후 연동 */}
      <button
        type="button"
        aria-label={`${projectName} ${selected ? '접기' : '펼치기'}`}
        aria-expanded={selected}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
        // 피그마 Icon Button: 기본 흰 배경 / 행 hover 시 회색 / 선택 시 연한 teal
        className={`flex size-[26px] shrink-0 items-center justify-center rounded-lg text-teal-grey-700 ${
          selected ? 'bg-teal-100' : 'group-hover:bg-teal-grey-100'
        }`}
      >
        <ToggleIcon size={24} />
      </button>
    </li>
  );
};

export default ApplicationTableRow;
