import { CloseIcon } from '@umc-product/icons';
import { Dimmed, IconButton, type PartTagPart } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { useState } from 'react';

import {
  type Applicant,
  APPLICANT_ROUND_OPTIONS,
  APPLICANT_STATUS_OPTIONS,
  type ApplicantRoundFilter,
  type ApplicantStatus,
  type ApplicantStatusFilter,
  AssignmentInfoTooltip,
  filterApplicants,
  PartApplicantList,
  type ProjectApplicationGroup,
  type RecruitPart,
} from '@/features/application-list';
import { Filtering } from '@/widgets/filtering';

import ApplicantApplicationModal from './ApplicantApplicationModal';

// 지원자 part 값과 모집 파트 매핑
const APPLICANT_PART: Record<RecruitPart, PartTagPart> = {
  DESIGN: 'design',
  WEB_PE: 'web-pe',
  MOBILE_PE: 'mobile-pe',
};

const RECRUIT_PARTS: RecruitPart[] = ['DESIGN', 'WEB_PE', 'MOBILE_PE'];

type ProjectApplicantsModalProps = {
  group: ProjectApplicationGroup | null; // null이면 닫힘
  chapterName: string; // 소속 지부
  onClose: () => void;
  // 배정 상태 변경. 없으면 조회만 (서버 규칙상 지부장 · 학교 운영진은 조회만)
  onStatusChange?: (applicant: Applicant, status: ApplicantStatus) => void;
  // 이 지원자의 배정 상태를 지금 바꿀 수 있는지 (서버 권한 + 그 차수의 결정 기간)
  canChangeStatus?: (applicant: Applicant) => boolean;
  isUpdatingStatus?: boolean; // 변경 요청 중 (중복 클릭 방지)
  canReadApplication?: boolean; // 지원서 열람 가능 여부 (권한표: 중앙운영진은 지원자 목록만)
};

// 어드민 지원 현황에서 프로젝트명을 누르면 뜨는 프로젝트 상세: 파트별 지원한 챌린저 목록
const ProjectApplicantsModal = ({
  group,
  chapterName,
  onClose,
  onStatusChange,
  canChangeStatus = () => false,
  isUpdatingStatus = false,
  canReadApplication = true,
}: ProjectApplicantsModalProps) => {
  const [round, setRound] = useState<ApplicantRoundFilter>('ALL');
  const [status, setStatus] = useState<ApplicantStatusFilter>('ALL');
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  // 배정 상태를 바꾸면 group이 새로 내려오므로 id로 다시 찾음
  const selectedApplicant =
    group?.applicants.find(({ applicantId }) => applicantId === selectedApplicantId) ?? null;

  const close = () => {
    setRound('ALL');
    setStatus('ALL');
    setSelectedApplicantId(null);
    onClose();
  };

  return (
    <>
      {/* 지원서가 열려 있는 동안은 프로젝트 상세를 숨기고, 지원서를 닫으면 필터를 그대로 둔 채 돌아옴 */}
      <Dialog.Root
        open={group !== null && selectedApplicant === null}
        onOpenChange={(open) => !open && close()}
      >
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <Dimmed />
          </Dialog.Overlay>
          {group && (
            <Dialog.Content
              aria-describedby={undefined}
              // 열 때 첫 버튼(info)에 포커스가 가면 포커스 링이 보여서 모달 자체에 포커스
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                (event.currentTarget as HTMLElement).focus();
              }}
              className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) flex h-[790px] max-h-[calc(100vh-40px)] w-[1040px] -translate-x-1/2 -translate-y-1/2 flex-col gap-[18px] overflow-hidden rounded-xl bg-white px-8 pb-8 outline-none"
            >
              <div className="flex w-full flex-col gap-8 pt-10 pb-2">
                <div className="flex flex-col gap-4 px-2.5">
                  <div className="flex items-center gap-2.5">
                    <p className="flex-1 text-body-3-semibold text-teal-600">{chapterName}</p>
                    <div className="flex items-center gap-2.5">
                      <AssignmentInfoTooltip />
                      <Dialog.Close asChild>
                        {/* 디자인 시스템 PanelCloseButton과 같은 흰색 Icon Button (피그마 26px) */}
                        <IconButton
                          variant="weak"
                          color="white"
                          size="md"
                          icon={<CloseIcon size={24} />}
                          aria-label="닫기"
                        />
                      </Dialog.Close>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Dialog.Title className="text-heading-2-semibold text-teal-grey-800">
                      {group.project.projectName}
                    </Dialog.Title>
                    <p className="text-body-2-medium text-teal-grey-500">
                      {group.project.challengerName} · {group.project.schoolName}
                    </p>
                  </div>
                </div>
                <Filtering
                  groups={[
                    {
                      label: '차수',
                      options: APPLICANT_ROUND_OPTIONS,
                      value: round,
                      onValueChange: (value) => setRound(value as ApplicantRoundFilter),
                    },
                    {
                      label: '지원 상태',
                      options: APPLICANT_STATUS_OPTIONS,
                      value: status,
                      onValueChange: (value) => setStatus(value as ApplicantStatusFilter),
                    },
                  ]}
                  className="px-5"
                />
              </div>
              {/* min-h-0이 있어야 남은 높이 안에서 스크롤됨 (없으면 내용만큼 늘어나 잘림) */}
              <div className="flex min-h-0 w-full flex-1 flex-col gap-[50px] overflow-y-auto pb-[34px]">
                {RECRUIT_PARTS.map((part) => {
                  const recruitment = group.project.recruitments[part];
                  // 모집하지 않는 PE 파트는 숨김
                  if (!recruitment) return null;
                  const applicants = group.applicants.filter(
                    (applicant) => applicant.part === APPLICANT_PART[part],
                  );

                  return (
                    <PartApplicantList
                      key={part}
                      part={part}
                      recruitment={recruitment}
                      applicants={applicants}
                      visibleApplicants={filterApplicants(applicants, round, status)}
                      onStatusChange={onStatusChange}
                      // 변경 요청 중에는 다른 칩도 잠깐 막음
                      canChangeStatus={(applicant) =>
                        !isUpdatingStatus && canChangeStatus(applicant)
                      }
                      // 지원서를 열 수 없는 역할은 이름을 눌러도 아무 동작 없음
                      onApplicantClick={
                        canReadApplication
                          ? ({ applicantId }) => setSelectedApplicantId(applicantId)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
      {group && (
        <ApplicantApplicationModal
          project={group.project}
          applicant={selectedApplicant}
          chapterName={chapterName}
          onClose={() => setSelectedApplicantId(null)}
          onStatusChange={onStatusChange}
          canChangeStatus={selectedApplicant !== null && canChangeStatus(selectedApplicant)}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
    </>
  );
};

export default ProjectApplicantsModal;
