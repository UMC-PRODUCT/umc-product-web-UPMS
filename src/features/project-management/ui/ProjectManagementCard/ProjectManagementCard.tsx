import { MoreVerticalIcon } from '@umc-product/icons';
import { Menu, type MenuItemDef, Tag, type TagColor } from '@umc-product/react';

import type { Role } from '@/entities/session';

import type {
  ManagedProject,
  PartRecruitment,
  ProjectStatus,
  RecruitPart,
} from '../../model/types';

const ADMIN_STATUS_TAG: Record<ProjectStatus, { label: string; color: TagColor }> = {
  DRAFT: { label: '임시 저장', color: 'neutral' },
  PENDING: { label: '승인 대기', color: 'warning' },
  APPROVED: { label: '승인 완료', color: 'brand' },
};

const PM_STATUS_TAG: Record<ProjectStatus, { label: string; color: TagColor }> = {
  DRAFT: { label: '임시 저장', color: 'neutral' },
  PENDING: { label: '승인 대기', color: 'warning' },
  APPROVED: { label: '등록 완료', color: 'brand' },
};

const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web PE',
  MOBILE_PE: 'Mobile PE',
};

const canDeleteProject = (role: Role, projectChapterId: string, ownChapterId: string) => {
  if (role === 'SUPER_ADMIN') return true;
  if (role === 'HQ_LEAD' || role === 'CHAPTER_ADMIN') return projectChapterId === ownChapterId;
  return false;
};

// 파트별 모집 현황 행 컴포넌트
const RecruitmentRow = ({ part, applied, capacity, status }: PartRecruitment) => (
  <li className="flex items-center justify-between">
    <div className="flex w-[117px] items-center justify-between">
      <span className="text-body-3-medium text-teal-grey-800">{PART_LABEL[part]}</span>
      <span className="flex items-center gap-0.5 text-caption-3-regular text-teal-grey-500">
        <span className="min-w-2 text-center">{applied}</span>
        <span className="w-[5px] text-right">/</span>
        <span className="min-w-2 text-center">{capacity}</span>
      </span>
    </div>
    <Tag
      variant="weak"
      color={status === 'RECRUITING' ? 'brand' : 'neutral'}
      size="sm"
      className="w-[60px]"
    >
      {status === 'RECRUITING' ? '모집 중' : '모집 완료'}
    </Tag>
  </li>
);

type ProjectManagementCardProps = {
  project: ManagedProject;
  role: Role;
  ownChapterId: string;
  isPmChallenger?: boolean;
  isApplicationPeriod?: boolean;
  isMatchingPeriod?: boolean;
  onCardClick?: () => void;
  onViewApplications?: () => void;
  onManageApproval?: () => void;
  onDelete?: () => void;
};

const ProjectManagementCard = ({
  project,
  role,
  ownChapterId,
  isPmChallenger = false,
  isApplicationPeriod = false,
  isMatchingPeriod = true,
  onCardClick,
  onViewApplications,
  onManageApproval,
  onDelete,
}: ProjectManagementCardProps) => {
  const {
    projectName,
    logoUrl,
    thumbnailUrl,
    pmName,
    schoolName,
    status,
    recruitments,
    chapterId,
  } = project;
  const statusTag = (isPmChallenger ? PM_STATUS_TAG : ADMIN_STATUS_TAG)[status];

  // 역할, 기간별 메뉴 아이템 구성
  const menuItems = (() => {
    if (isPmChallenger) {
      const items: MenuItemDef[] = [];
      if (status === 'APPROVED') {
        items.push({ label: '지원 현황 확인하기', onClick: onViewApplications });
      }
      items.push({
        label: <span className={isMatchingPeriod ? undefined : 'text-error'}>삭제</span>,
        onClick: onDelete,
        disabled: isMatchingPeriod,
      });
      return items;
    }
    if (role === 'HQ_ADMIN') {
      return [{ label: '지원 현황 확인하기', onClick: onViewApplications }];
    }
    const items: MenuItemDef[] = [
      { label: '지원 현황 확인하기', onClick: onViewApplications },
      { label: '프로젝트 승인 관리', onClick: onManageApproval },
    ];
    if (canDeleteProject(role, chapterId, ownChapterId)) {
      items.push({
        label: <span className={isApplicationPeriod ? undefined : 'text-error'}>삭제</span>,
        onClick: onDelete,
        disabled: isApplicationPeriod,
      });
    }
    return items;
  })();

  return (
    <article
      className={`flex w-full items-center gap-7 rounded-2xl border border-teal-grey-100 bg-white py-2.5 pr-5 pl-2.5 shadow-drop-neutral-2${onCardClick ? 'cursor-pointer' : ''}`}
      onClick={onCardClick}
    >
      <div className="h-40 w-80 shrink-0 overflow-hidden rounded-[10px] bg-teal-grey-100">
        {thumbnailUrl && <img src={thumbnailUrl} alt="" className="size-full object-cover" />}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-teal-grey-100">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={`${projectName} 로고`}
                    className="size-full object-cover"
                  />
                )}
              </div>
              <h3 className="truncate text-heading-4-semibold text-teal-grey-900">{projectName}</h3>
              <Tag variant="weak" color={statusTag.color} size="md" className="shrink-0">
                {statusTag.label}
              </Tag>
            </div>
            {menuItems && (
              <div onClick={(e) => e.stopPropagation()}>
                <Menu
                  trigger={
                    <button
                      type="button"
                      aria-label="더보기"
                      className="shrink-0 rounded p-1 text-teal-grey-500 hover:bg-teal-grey-75"
                    >
                      <MoreVerticalIcon size={20} />
                    </button>
                  }
                  items={menuItems}
                  size="sm"
                />
              </div>
            )}
          </div>
          <p className="text-body-3-medium text-teal-grey-500">
            {pmName} · {schoolName}
          </p>
        </div>

        <ul className="flex flex-col gap-[5px]">
          {recruitments.map((recruitment) => (
            <RecruitmentRow key={recruitment.part} {...recruitment} />
          ))}
        </ul>
      </div>
    </article>
  );
};

export default ProjectManagementCard;
