import { GuidanceMessage, ImageThumbnail, Tag } from '@umc-product/react';
import type { ReactNode } from 'react';

type RecruitStatus = 'RECRUITING' | 'CLOSED';

export type ProjectCardRecruitment = {
  label: string; // 파트 이름 (예: Design, Web, Mobile)
  applied: number;
  capacity: number;
  status: RecruitStatus;
};

type ProjectCardProps = {
  projectName: string;
  logoUrl: string | null; // 없으면 기본 로고
  thumbnailUrl: string | null; // 없으면 회색 칸
  pmName: string; // 닉네임/이름
  schoolName: string;
  description: string; // 200자 이내, 말줄임 없이 전문 표시
  recruitments: ProjectCardRecruitment[];
  actions?: ReactNode; // 하단 버튼 영역. 화면마다 버튼 구성이 달라 밖에서 넘김
  actionNotice?: string; // 버튼 아래 안내 문구 (예: 버튼이 비활성인 이유)
  className?: string;
};

const RECRUIT_STATUS_TAG: Record<RecruitStatus, { label: string; color: 'brand' | 'neutral' }> = {
  RECRUITING: { label: '모집 중', color: 'brand' },
  CLOSED: { label: '모집 완료', color: 'neutral' },
};

// 피그마 Project Detail Card: 썸네일 + 프로젝트 소개 + 파트별 모집 현황 + 버튼
const ProjectCard = ({
  projectName,
  logoUrl,
  thumbnailUrl,
  pmName,
  schoolName,
  description,
  recruitments,
  actions,
  actionNotice,
  className = '',
}: ProjectCardProps) => (
  <article
    className={`flex w-[648px] flex-col overflow-hidden rounded-[20px] bg-white shadow-drop-neutral-3 ${className}`}
  >
    {/* 등록한 이미지 규격과 관계없이 372:186 비율 칸을 꽉 채워 자름 */}
    <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-teal-grey-100">
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt="" className="absolute inset-0 size-full object-cover" />
      )}
    </div>
    <div className="flex flex-col gap-8 p-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <ImageThumbnail src={logoUrl} alt={`${projectName} 로고`} size={40} />
              <h2 className="truncate text-heading-2-semibold text-teal-grey-900">{projectName}</h2>
            </div>
            <p className="shrink-0 text-body-1-regular whitespace-nowrap text-teal-grey-500">
              {pmName} · {schoolName}
            </p>
          </div>
          <p className="text-body-1-regular text-teal-grey-600">{description}</p>
        </div>
        <ul className="flex flex-col gap-2">
          {recruitments.map(({ label, applied, capacity, status }) => {
            const statusTag = RECRUIT_STATUS_TAG[status];
            return (
              <li key={label} className="flex items-center justify-between">
                <div className="flex w-[122px] items-center justify-between">
                  <span className="text-body-1-medium text-teal-grey-900">{label}</span>
                  {/* 지원 인원 / 모집 인원 */}
                  <span className="flex items-center gap-0.5 text-body-1-medium text-teal-grey-600">
                    <span className="min-w-[9px]">{applied}</span>
                    <span className="w-[5px] font-normal">/</span>
                    <span className="min-w-2">{capacity}</span>
                  </span>
                </div>
                <Tag variant="weak" color={statusTag.color} size="md">
                  {statusTag.label}
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
      {actions && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full items-start gap-2.5">{actions}</div>
          {actionNotice && <GuidanceMessage color="neutral">{actionNotice}</GuidanceMessage>}
        </div>
      )}
    </div>
  </article>
);

export default ProjectCard;
