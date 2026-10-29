import { OpenNewIcon } from '@umc-product/icons';
import { Button, FormHeader, FormSheet, IconButton, ImageThumbnail } from '@umc-product/react';

import {
  type AppliedProject,
  getVisibleRecruitments,
  RecruitmentList,
  type RecruitPart,
  useApplicationDetail,
} from '@/features/applications';
import { ApplicationForm } from '@/widgets/application';

// 지원서 머리는 PE를 플랫폼 이름으로만 표기
const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web',
  MOBILE_PE: 'Mobile',
};

type MyApplicationViewProps = {
  project: AppliedProject;
  applicationId: number;
  logoUrl: string | null; // 프로젝트 상세에서 불러옴 (불러오기 전이면 기본 로고)
  description: string; // 프로젝트 소개 (불러오기 전이면 빈 문자열)
  isCanceling: boolean; // 지원 취소 요청 중
  onCancelClick: () => void; // 지원 취소 경고창 열기
};

// 피그마 내 지원서 보기 (Web/Form/Sheet): 탭 모양 프로젝트 라벨(Form/Header) + 프로젝트 요약 + 제출한 지원서
const MyApplicationView = ({
  project,
  applicationId,
  logoUrl,
  description,
  isCanceling,
  onCancelClick,
}: MyApplicationViewProps) => {
  const application = useApplicationDetail({ projectId: project.projectId, applicationId });

  return (
    <FormSheet
      className="w-[928px]"
      header={
        <FormHeader
          thumbnail={<ImageThumbnail src={logoUrl} alt={`${project.projectName} 로고`} size={50} />}
          title={project.projectName}
          subtitle={`${project.pmName} · ${project.schoolName}`}
        />
      }
      // TODO: 새 창으로 열 대상(프로젝트 상세 등)이 정해지면 연결
      action={
        <IconButton
          variant="weak"
          color="white"
          size="sm"
          icon={<OpenNewIcon size={20} />}
          aria-label="새 창으로 열기"
        />
      }
      description={
        <div className="flex items-start gap-5">
          <p className="flex-1 text-body-1-regular text-teal-grey-600">{description}</p>
          <RecruitmentList
            recruitments={getVisibleRecruitments(project)}
            partLabels={PART_LABEL}
            className="w-[298px] shrink-0"
          />
        </div>
      }
      // 지원 기간 동안만 취소 · 수정 가능 (false를 넘기면 빈 버튼 영역이 남아서 undefined)
      control={
        project.applicationEditable ? (
          // TODO: 수정 하기는 해당 프로젝트 지원하기 폼으로 이동
          <div className="flex flex-1 items-center justify-center gap-3">
            <Button
              variant="weak"
              color="red"
              size="lg"
              className="w-[140px]"
              disabled={isCanceling}
              onClick={onCancelClick}
            >
              지원 취소
            </Button>
            <Button variant="weak" size="lg" className="w-[140px]">
              수정 하기
            </Button>
          </div>
        ) : undefined
      }
    >
      {/* TODO: 불러오는 중 · 실패 화면이 피그마에 나오면 교체 */}
      {application.isError && (
        <p role="alert" className="text-body-3-medium text-red-500">
          지원서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {application.data && <ApplicationForm sections={application.data} />}
    </FormSheet>
  );
};

export default MyApplicationView;
