import {
  FormHeader,
  FormSheet,
  ImageThumbnail,
  OptionButtonGroup,
  type PartTagPart,
} from '@umc-product/react';

import {
  type Applicant,
  APPLICANT_STATUS_TAG,
  APPLICANT_STATUSES,
  type ApplicantStatus,
  type ProjectApplicationRow,
} from '@/features/application-list';
import { useApplicationDetail, useProjectDetail } from '@/features/applications';
import UpmsPanel from '@/shared/ui/UpmsPanel';
import { ApplicationForm } from '@/widgets/application';

// 지원서 제목의 파트 이름 (예: Design 파트 지원서)
const PART_LABEL: Record<PartTagPart, string> = {
  pm: 'PM',
  design: 'Design',
  'web-pe': 'Web PE',
  'mobile-pe': 'Mobile PE',
};

const STATUS_OPTIONS = APPLICANT_STATUSES.map((status) => ({
  value: status,
  label: APPLICANT_STATUS_TAG[status].label,
}));

type ApplicantApplicationModalProps = {
  project: ProjectApplicationRow;
  applicant: Applicant | null; // null이면 닫힘
  chapterName: string; // 소속 지부
  onClose: () => void;
  // 배정 상태 변경. 없거나 canChangeStatus가 false면 조회만 (선택 버튼 비활성)
  onStatusChange?: (applicant: Applicant, status: ApplicantStatus) => void;
  canChangeStatus?: boolean; // 서버 권한 + 이 지원자 차수의 결정 기간
  isUpdatingStatus?: boolean; // 변경 요청 중 (중복 클릭 방지)
};

// 지원자 이름을 누르면 뜨는 지원서 (어드민: 프로젝트 상세에서, PM: 지원자 목록에서)
// 배정 상태 선택 + 프로젝트 라벨 + 제출한 지원서 (문항은 챌린저가 보는 지원서와 같은 컴포넌트)
const ApplicantApplicationModal = ({
  project,
  applicant,
  chapterName,
  onClose,
  onStatusChange,
  canChangeStatus = false,
  isUpdatingStatus = false,
}: ApplicantApplicationModalProps) => {
  // 모달을 열 때만 지원서 · 프로젝트 로고를 불러옴
  // 서버 규칙: PM도 지원서 내용은 지원 마감 후부터 볼 수 있음 (그 전엔 403)
  const application = useApplicationDetail(
    applicant && { projectId: project.projectId, applicationId: applicant.applicationId },
  );
  const { data: projectDetail } = useProjectDetail(applicant && project.projectId);

  return (
    <UpmsPanel
      open={applicant !== null}
      onOpenChange={(open) => !open && onClose()}
      eyebrow={chapterName}
      title={
        applicant && (
          <>
            <span className="font-bold text-teal-600">{PART_LABEL[applicant.part]}</span> 파트
            지원서
          </>
        )
      }
      titleAction={
        applicant && (
          // 피그마 매칭 종료 시: 결정 기간이 끝난 차수의 지원자는 결과가 확정돼 선택 버튼이 비활성
          <OptionButtonGroup
            aria-label="배정 상태"
            size="xs"
            options={STATUS_OPTIONS}
            value={applicant.status}
            disabled={!onStatusChange || !canChangeStatus || isUpdatingStatus}
            onValueChange={(status) => onStatusChange?.(applicant, status)}
          />
        )
      }
      subtitle={applicant && `${applicant.challengerName} · ${applicant.schoolName}`}
      className="h-[790px] w-[1104px]"
    >
      {applicant && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5">
          {/* 스크롤 영역 안에서 줄지 않도록 shrink-0 */}
          <FormSheet
            className="shrink-0"
            header={
              <FormHeader
                thumbnail={
                  <ImageThumbnail
                    src={projectDetail?.logoUrl ?? null}
                    alt={`${project.projectName} 로고`}
                    size={50}
                  />
                }
                title={project.projectName}
                subtitle={`${project.challengerName} · ${project.schoolName}`}
              />
            }
            // 피그마: 버튼 없이 위 여백(24px)만 있는 액션 줄. null도 줄을 그림
            action={null}
          >
            {/* TODO: 불러오는 중 · 실패 화면이 피그마에 나오면 교체 */}
            {application.isError && (
              <p role="alert" className="text-body-3-medium text-red-500">
                {application.error.message}
              </p>
            )}
            {application.data && <ApplicationForm sections={application.data} readOnly />}
          </FormSheet>
        </div>
      )}
    </UpmsPanel>
  );
};

export default ApplicantApplicationModal;
