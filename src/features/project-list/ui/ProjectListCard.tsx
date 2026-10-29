import { Tag } from '@umc-product/react';

import { getRecruitmentRows } from '../model/getRecruitmentRows';
import type { PartRecruitment, Project, ProjectPeriod } from '../model/types';

const RECRUIT_STATUS_TAG: Record<
  PartRecruitment['status'],
  { label: string; color: 'brand' | 'neutral' }
> = {
  RECRUITING: { label: '모집 중', color: 'brand' },
  CLOSED: { label: '모집 완료', color: 'neutral' },
};

type ProjectListCardProps = {
  project: Project;
  period: ProjectPeriod;
  onClick: () => void; // 상세 모달 열기
};

// 피그마 Project Card: 썸네일 + 프로젝트 소개 + 파트별 지원 인원 / 모집 인원
const ProjectListCard = ({ project, period, onClick }: ProjectListCardProps) => {
  const { projectName, thumbnailUrl, pmName, schoolName, description } = project;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl bg-white shadow-drop-neutral-2 transition-shadow focus-within:shadow-drop-neutral-3 hover:shadow-drop-neutral-3">
      {/* 카드 안에 목록 · 제목이 있어 button으로 감쌀 수 없어서 카드 전체를 덮는 버튼을 둠 */}
      <button
        type="button"
        aria-label={`${projectName} 상세 보기`}
        onClick={onClick}
        className="absolute inset-0 z-10 cursor-pointer rounded-xl"
      />
      <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-teal-grey-100">
        {thumbnailUrl && (
          <img src={thumbnailUrl} alt="" className="absolute inset-0 size-full object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex h-[98px] flex-col justify-center gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate text-heading-4-semibold text-teal-grey-900">
              {projectName}
            </h3>
          </div>
          <p className="line-clamp-2 h-[42px] text-body-3-regular text-teal-grey-600">
            {description}
          </p>
          <p className="text-caption-2-regular text-teal-grey-500">
            {pmName} · {schoolName}
          </p>
        </div>
        <ul className="flex flex-col gap-[5px]">
          {getRecruitmentRows(project, period, 'card').map(
            ({ part, label, applied, capacity, status }) => {
              const statusTag = RECRUIT_STATUS_TAG[status];
              return (
                <li key={part} className="flex items-center justify-between">
                  <div className="flex w-[116px] items-center justify-between">
                    <span className="text-body-2-medium text-teal-grey-800">{label}</span>
                    {/* 지원 인원 / 모집 인원 */}
                    <span className="flex items-center gap-0.5 text-body-3-regular text-teal-grey-500">
                      <span className="min-w-2 text-center">{applied}</span>
                      <span className="w-[5px] text-right">/</span>
                      <span className="min-w-2 text-center">{capacity}</span>
                    </span>
                  </div>
                  <Tag variant="weak" color={statusTag.color} size="sm">
                    {statusTag.label}
                  </Tag>
                </li>
              );
            },
          )}
        </ul>
      </div>
    </article>
  );
};

export default ProjectListCard;
