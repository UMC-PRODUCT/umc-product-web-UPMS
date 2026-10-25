import { CloseIcon } from '@umc-product/icons';
import {
  Dimmed,
  IconButton,
  OptionButtonGroup,
  type PartTagPart,
  StatusTag,
  Tag,
} from '@umc-product/react';
import { Dialog } from 'radix-ui';

import {
  type Applicant,
  APPLICANT_STATUS_TAG,
  APPLICANT_STATUSES,
  type ApplicantStatus,
  isMatchingRoundOpen,
  type ProjectApplicationRow,
  type RecruitPart,
} from '@/features/application-list';
import { MOCK_MY_APPLICATION } from '@/features/applications';
import ProjectHeader from '@/shared/ui/ProjectHeader/ProjectHeader';
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

// 지원자 파트에 해당하는 모집 파트 (PM은 모집하지 않음)
const RECRUIT_PART: Partial<Record<PartTagPart, RecruitPart>> = {
  design: 'DESIGN',
  'web-pe': 'WEB_PE',
  'mobile-pe': 'MOBILE_PE',
};

type PartRecruitmentSummaryProps = {
  project: ProjectApplicationRow;
  part: PartTagPart; // 지원자가 지원한 파트
};

// 프로젝트 헤더 오른쪽 위: 지원한 파트의 지원/모집 인원과 모집 상태
const PartRecruitmentSummary = ({ project, part }: PartRecruitmentSummaryProps) => {
  const recruitPart = RECRUIT_PART[part];
  const recruitment = recruitPart && project.recruitments[recruitPart];
  if (!recruitment) return null;
  const recruiting = recruitment.applied < recruitment.capacity;

  return (
    <div className="flex items-center gap-3">
      <p className="flex items-center gap-2.5">
        <span className="text-body-3-medium text-teal-grey-700">{PART_LABEL[part]}</span>
        {/* 지원 인원 / 모집 인원 */}
        <span className="flex items-center gap-0.5 text-caption-3-regular text-teal-grey-500">
          <span className="min-w-2 text-center">{recruitment.applied}</span>
          <span className="w-[5px] text-right">/</span>
          <span className="min-w-2 text-center">{recruitment.capacity}</span>
        </span>
      </p>
      <Tag variant="weak" color={recruiting ? 'brand' : 'neutral'} size="sm">
        {recruiting ? '모집 중' : '모집 완료'}
      </Tag>
    </div>
  );
};

type ApplicantApplicationModalProps = {
  project: ProjectApplicationRow;
  applicant: Applicant | null; // null이면 닫힘
  chapterName: string; // 소속 지부
  onClose: () => void;
  // 배정 상태 변경. 없으면 조회만 (선택 버튼 비활성)
  onStatusChange?: (applicantId: string, status: ApplicantStatus) => void;
};

// 지원자 이름을 누르면 뜨는 지원서 (어드민: 프로젝트 상세에서, PM: 지원자 목록에서)
// 배정 상태 선택 + 프로젝트 라벨 + 제출한 지원서 (문항은 챌린저가 보는 지원서와 같은 컴포넌트)
const ApplicantApplicationModal = ({
  project,
  applicant,
  chapterName,
  onClose,
  onStatusChange,
}: ApplicantApplicationModalProps) => (
  <Dialog.Root open={applicant !== null} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay asChild>
        <Dimmed />
      </Dialog.Overlay>
      {applicant && (
        <Dialog.Content
          aria-describedby={undefined}
          // 열 때 첫 버튼(닫기)에 포커스 링이 보이지 않도록 모달 자체에 포커스
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            (event.currentTarget as HTMLElement).focus();
          }}
          className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) flex h-[790px] max-h-[calc(100vh-40px)] w-[1182px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-[22px] overflow-hidden rounded-xl bg-white px-8 outline-none"
        >
          <div className="flex w-full flex-col gap-4 px-2.5 pt-12 pb-2">
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-body-3-semibold text-teal-600">{chapterName}</p>
              <Dialog.Close asChild>
                <IconButton
                  variant="weak"
                  color="white"
                  size="md"
                  icon={<CloseIcon size={24} />}
                  aria-label="닫기"
                />
              </Dialog.Close>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between">
                <Dialog.Title className="text-heading-2-semibold text-teal-grey-800">
                  <span className="font-bold text-teal-600">{PART_LABEL[applicant.part]}</span> 파트
                  지원서
                </Dialog.Title>
                {/* 피그마 매칭 종료 시: 끝난 차수의 지원자는 결과가 확정돼 선택 버튼이 비활성 */}
                <OptionButtonGroup
                  aria-label="배정 상태"
                  size="xs"
                  options={STATUS_OPTIONS}
                  value={applicant.status}
                  disabled={!onStatusChange || !isMatchingRoundOpen(applicant.round)}
                  onValueChange={(status) => onStatusChange?.(applicant.applicantId, status)}
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-body-2-medium text-teal-grey-500">
                  {applicant.challengerName} · {applicant.schoolName}
                </p>
                <StatusTag color={APPLICANT_STATUS_TAG[applicant.status].color}>
                  {APPLICANT_STATUS_TAG[applicant.status].label}
                </StatusTag>
              </div>
            </div>
          </div>
          {/* min-h-0이 있어야 남은 높이 안에서 스크롤됨 */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-8">
            {/* TODO: 지원서 API 연동 시 프로젝트 로고 연동 */}
            <ProjectHeader
              size="md"
              projectName={project.projectName}
              logoUrl={null}
              pmName={project.challengerName}
              schoolName={project.schoolName}
              aside={<PartRecruitmentSummary project={project} part={applicant.part} />}
              // 피그마: 헤더(1090px)가 아래 지원서보다 오른쪽이 28px 짧음. 스크롤 영역 안에서 줄지 않도록 shrink-0
              className="shrink-0 pr-7"
            />
            <div className="flex flex-col bg-white px-7 pt-7">
              {/* TODO: 지원자별 지원서 API 연동 */}
              <ApplicationForm sections={MOCK_MY_APPLICATION} readOnly />
            </div>
          </div>
        </Dialog.Content>
      )}
    </Dialog.Portal>
  </Dialog.Root>
);

export default ApplicantApplicationModal;
