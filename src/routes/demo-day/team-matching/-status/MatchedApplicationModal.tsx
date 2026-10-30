import { RemoveCircleIcon, WarningTriangleIcon } from '@umc-product/icons';
import {
  Button,
  Dialog,
  FormHeader,
  FormSheet,
  ImageThumbnail,
  StatusTag,
} from '@umc-product/react';
import { useState } from 'react';

import { useProjectApplicants } from '@/features/application-list';
import { useApplicationDetail, useProjectDetail } from '@/features/applications';
import {
  type MatchedMember,
  type MatchingPart,
  type PartMatching,
  type ProjectMatchingResult,
  useReleaseProjectMember,
} from '@/features/matching-status';
import UpmsPanel from '@/shared/ui/UpmsPanel';
import { ApplicationForm } from '@/widgets/application';
import { useAppToast } from '@/widgets/toast';

// 지원서 제목의 파트 이름 (예: Design 파트 지원서)
const PART_TITLE: Record<MatchingPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web PE',
  MOBILE_PE: 'Mobile PE',
};

const pad = (value: number) => String(value).padStart(2, '0');

// "2026-10-01 10:00"
const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// "10월 12일 18시"
const formatMatchedAt = (iso: string) => {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시`;
};

export type MatchedApplicationTarget = {
  project: ProjectMatchingResult;
  part: PartMatching;
  member: MatchedMember;
};

type MatchedApplicationModalProps = {
  target: MatchedApplicationTarget | null; // null이면 닫힘
  chapterName: string; // 소속 지부
  onClose: () => void;
  canRelease: boolean; // 매칭 해제 가능 여부 (서버 권한 canUnassign). false면 조회만 (버튼 숨김)
  onReleased: () => void; // 매칭 해제 완료 (모달 닫기 · 안내)
};

// 매칭 결과 시트에서 매칭된 챌린저 이름을 누르면 뜨는 파트 지원서
// 지원 현황의 지원자 지원서 모달과 같은 틀(UpmsPanel · FormSheet · ApplicationForm)에 어드민만 매칭 해제 가능
const MatchedApplicationModal = ({
  target,
  chapterName,
  onClose,
  canRelease,
  onReleased,
}: MatchedApplicationModalProps) => {
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const release = useReleaseProjectMember();
  const toast = useAppToast();

  // 팀원 구성에는 지원서 ID가 없어서, 프로젝트 지원자 중 이 멤버의 합격 지원서를 찾음
  // 지원 없이 수동 배정된 팀원은 지원서가 없음
  const projectId = target?.project.projectId ?? null;
  const applicants = useProjectApplicants(projectId);
  const application = applicants.data?.find(
    ({ memberId, status }) => memberId === target?.member.memberId && status === 'PASSED',
  );
  const detail = useApplicationDetail(
    projectId !== null && application
      ? { projectId, applicationId: application.applicationId }
      : null,
  );
  const { data: project } = useProjectDetail(projectId);
  // 제출 시각 · 매칭 시각(합격 처리 시각)은 팀원 구성에 없어서 지원서에서 가져옴
  const submittedAt = target?.member.submittedAt ?? application?.appliedAt ?? null;
  const matchedAt = target?.member.matchedAt ?? application?.processedAt ?? null;

  const handleRelease = () => {
    if (!target) return;
    setReleaseDialogOpen(false);
    release.mutate(
      { projectId: target.project.projectId, memberId: target.member.memberId },
      {
        onSuccess: onReleased,
        onError: (error) => toast.show(error.message, { color: 'error' }),
      },
    );
  };

  return (
    <UpmsPanel
      open={target !== null}
      onOpenChange={(open) => !open && onClose()}
      eyebrow={chapterName}
      title={
        target && (
          <>
            <span className="font-bold text-teal-600">{PART_TITLE[target.part.part]}</span> 파트
            지원서
          </>
        )
      }
      titleAction={
        canRelease && (
          <Button
            variant="fill"
            color="white"
            size="sm"
            leadingIcon={<RemoveCircleIcon size={16} />}
            disabled={release.isPending}
            onClick={() => setReleaseDialogOpen(true)}
          >
            매칭 해제
          </Button>
        )
      }
      subtitle={target && `${target.member.challengerName} · ${target.member.schoolName}`}
      className="h-[790px] w-[1104px]"
    >
      {target && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5">
          <FormSheet
            className="shrink-0"
            header={
              <FormHeader
                thumbnail={
                  <ImageThumbnail
                    src={project?.logoUrl ?? null}
                    alt={`${target.project.projectName} 로고`}
                    size={50}
                  />
                }
                title={target.project.projectName}
                subtitle={`${target.project.pmName} · ${target.project.pmSchoolName}`}
                caption={
                  <>
                    {submittedAt && (
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span>{formatDateTime(submittedAt)}</span>
                        <span>제출됨</span>
                      </span>
                    )}
                    {/* 매칭된 챌린저는 합격 */}
                    <StatusTag color="success">합격</StatusTag>
                  </>
                }
              />
            }
            // 피그마: 버튼 없이 위 여백(24px)만 있는 액션 줄. null도 줄을 그림
            action={null}
          >
            {/* TODO: 불러오는 중 · 실패 · 지원서 없음 화면이 피그마에 나오면 교체 */}
            {(applicants.isError || detail.isError) && (
              <p role="alert" className="text-body-3-medium text-red-500">
                {(detail.error ?? applicants.error)?.message}
              </p>
            )}
            {applicants.isSuccess && !application && (
              <p className="text-body-3-medium text-teal-grey-500">
                지원서 없이 수동으로 배정된 챌린저예요.
              </p>
            )}
            {detail.data && <ApplicationForm sections={detail.data} readOnly />}
          </FormSheet>
        </div>
      )}
      {target && canRelease && (
        <Dialog
          // 아래 radix 패널이 body 클릭을 막아서(pointer-events: none) 확인창만 다시 열어 줌
          className="pointer-events-auto"
          open={releaseDialogOpen}
          onOpenChange={setReleaseDialogOpen}
          color="error"
          icon={<WarningTriangleIcon weight="fill" size={24} className="text-red-500" />}
          title="매칭을 해제할까요?"
          description={
            <>
              {/* 매칭 시각을 모르면(수동 배정 등) 이 줄은 빼고 안내 */}
              {matchedAt && (
                <>
                  {formatMatchedAt(matchedAt)}에 매칭된 챌린저예요.
                  <br />
                </>
              )}
              매칭을 해제하면 현재 매칭 상태가 취소되며, 이후 필요할 때 수동으로 다시 배정할 수
              있어요.
            </>
          }
          cancelLabel="돌아가기"
          confirmLabel="매칭 해제"
          onConfirm={handleRelease}
        />
      )}
    </UpmsPanel>
  );
};

export default MatchedApplicationModal;
