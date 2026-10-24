import { Button } from '@umc-product/react';

import {
  type AppliedProject,
  getVisibleRecruitments,
  MOCK_MY_APPLICATION,
  RecruitmentList,
  type RecruitPart,
} from '@/features/applications';
import { ApplicationForm } from '@/widgets/application';

import ProjectHeader from './ProjectHeader';

// 지원서 머리는 PE를 플랫폼 이름으로만 표기
const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web',
  MOBILE_PE: 'Mobile',
};

type MyApplicationViewProps = {
  project: AppliedProject;
  onCancelClick: () => void; // 지원 취소 경고창 열기
};

// 피그마 내 지원서 보기: 탭 모양 프로젝트 라벨(Project header Lg) + 프로젝트 요약 + 제출한 지원서
const MyApplicationView = ({ project, onCancelClick }: MyApplicationViewProps) => (
  <div className="flex w-[928px] flex-col">
    <ProjectHeader
      size="lg"
      projectName={project.projectName}
      logoUrl={project.logoUrl}
      pmName={project.pmName}
      schoolName={project.schoolName}
    />
    <div className="flex flex-col items-center gap-12 rounded-b-xl bg-white px-[46px] pt-9 pb-11 shadow-drop-neutral-3">
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-start gap-6">
          <p className="flex-1 text-body-1-regular text-teal-grey-600">{project.description}</p>
          <RecruitmentList
            recruitments={getVisibleRecruitments(project)}
            partLabels={PART_LABEL}
            className="w-[298px] shrink-0"
          />
        </div>
        {/* TODO: 프로젝트별 내 지원서 API 연동 */}
        <ApplicationForm sections={MOCK_MY_APPLICATION} />
      </div>
      {/* 지원 기간 동안만 취소 · 수정 가능 */}
      {project.applicationEditable && (
        // TODO: 수정 하기는 해당 프로젝트 지원하기 폼으로 이동
        <div className="flex items-center gap-4">
          <Button
            variant="weak"
            color="red"
            size="lg"
            className="w-[200px]"
            onClick={onCancelClick}
          >
            지원 취소
          </Button>
          <Button variant="weak" size="lg" className="w-[200px]">
            수정 하기
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default MyApplicationView;
