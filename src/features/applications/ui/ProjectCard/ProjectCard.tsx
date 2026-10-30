import { ImageThumbnail } from '@umc-product/react';

import { MatchingResultTag } from '@/shared/ui/MatchingResultTag';

import { getVisibleRecruitments } from '../../model/getVisibleRecruitments';
import type { AppliedProject } from '../../model/types';
import RecruitmentList from '../RecruitmentList/RecruitmentList';

type ProjectCardProps = {
  project: AppliedProject;
  showResult?: boolean; // 랜덤 매칭은 합격 · 불합격 미노출
  onClick?: () => void; // 있으면 카드 전체가 버튼 (상세 모달 열기)
};

// 피그마 Project Card_Md Horizen: 썸네일 + 프로젝트 정보 + 파트별 모집 현황
const ProjectCard = ({ project, showResult = true, onClick }: ProjectCardProps) => {
  const { projectName, thumbnailUrl, pmName, schoolName, result } = project;
  const recruitments = getVisibleRecruitments(project);

  return (
    <article
      className={`relative flex w-full items-center gap-7 rounded-2xl border border-teal-grey-100 bg-white py-2.5 pr-5 pl-2.5 shadow-drop-neutral-2 ${
        onClick ? 'hover:bg-teal-grey-75' : ''
      }`}
    >
      {onClick && (
        // 카드 안에 목록 · 제목이 있어 button으로 감쌀 수 없어서 카드 전체를 덮는 버튼을 둠
        <button
          type="button"
          aria-label={`${projectName} 상세 보기`}
          onClick={onClick}
          className="absolute inset-0 cursor-pointer rounded-2xl"
        />
      )}
      <div className="h-40 w-80 shrink-0 overflow-hidden rounded-[10px] bg-teal-grey-100">
        {thumbnailUrl && <img src={thumbnailUrl} alt="" className="size-full object-cover" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {/* TODO: 내 지원 목록 API(ProjectBrief)에 로고가 없어 기본 로고. 백엔드에 logoImageUrl 추가 요청 */}
              <ImageThumbnail src={null} alt={`${projectName} 로고`} size={30} />
              <h3 className="truncate text-heading-4-semibold text-teal-grey-900">{projectName}</h3>
            </div>
            {showResult && result && <MatchingResultTag result={result} className="shrink-0" />}
          </div>
          <p className="text-body-3-medium text-teal-grey-500">
            {pmName} · {schoolName}
          </p>
        </div>
        <RecruitmentList recruitments={recruitments} />
      </div>
    </article>
  );
};

export default ProjectCard;
