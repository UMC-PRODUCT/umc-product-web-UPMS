import { useQuery } from '@tanstack/react-query';
import { useBlocker } from '@tanstack/react-router';
import { Button, Dialog, PageHeader, StepNavigation } from '@umc-product/react';
import { useEffect, useRef, useState } from 'react';

import { myInfoQueryOptions, useProjectRegisterAccess, useSessionStore } from '@/entities/session';
import {
  BasicInfoStep,
  createInitialDraft,
  createServerProjectState,
  hasDraftContent,
  isBasicInfoComplete,
  isQuestionsComplete,
  isRecruitComplete,
  type PePlatform,
  type ProjectDraft,
  QuestionStep,
  RecruitInfoStep,
  useEditProject,
  useMyDraftProject,
  usePmCandidates,
  useSaveProject,
} from '@/features/project-register';
import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';
import { formatSchoolName } from '@/shared/lib/formatSchoolName';
import { useAppToast } from '@/widgets/toast';

const BREADCRUMBS = [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '프로젝트 설정', href: '/demo-day/project-settings/notice' },
  { label: '프로젝트 관리', href: '/demo-day/project-settings/projects' },
  { label: '프로젝트 등록' },
];

const STEPS = ['기본 정보', '모집 정보', '지원 문항'];

// 피그마 토스트 케이스 모음
const TOAST_MESSAGE = {
  incomplete: '모든 항목을 입력해 주세요',
  sectionIncomplete: '사용 중인 섹션의 항목을 모두 입력하세요',
  draftSaved: '프로젝트가 임시 저장됐어요',
  registered: '프로젝트가 등록되었어요',
  thumbnailRejected: 'JPG, PNG 형식의 10MB 이하 파일만 올릴 수 있어요',
  logoRejected: 'PNG, SVG 형식의 5MB 이하 파일만 올릴 수 있어요',
  failed: '저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
};

const PE_PLATFORM_LABEL: Record<PePlatform, string> = { WEB: 'Web', MOBILE: 'Mobile' };

type ProjectRegisterPageProps = {
  onComplete: () => void;
  projectId?: number; // 수정 모드: 기존 프로젝트 ID
};

// 피그마 프로젝트 등록: 1 기본 정보 → 2 모집 정보 → 3 지원 문항
// 운영진(마스터 · 지부장)은 PM을 골라 등록하고 모집 정보도 입력, PM은 본인 정보가 채워진 채 모집 정보를 조회만 함
// 단계 번호: 1 기본 정보 · 2 모집 정보 · 3 지원 문항
const RECRUIT_STEP = 2;

const ProjectRegisterPage = ({ onComplete, projectId }: ProjectRegisterPageProps) => {
  const toast = useAppToast();
  const access = useProjectRegisterAccess();
  const { role, gisuId, serverChapterId } = useSessionStore((state) => state.session);
  const { data: myInfo } = useQuery(myInfoQueryOptions);
  const { hasDraft, loadDraft } = useMyDraftProject(gisuId);
  const { mutateAsync: saveProject } = useSaveProject();
  const isEditMode = projectId !== undefined;
  const { editData, isPending: isEditLoading } = useEditProject(isEditMode ? projectId : null);

  const isAdmin = access === 'ADMIN';
  // 지부장은 본인 지부 PM만 고를 수 있음
  const { data: pmCandidates = [] } = usePmCandidates({
    gisuId,
    chapterId: role === 'CHAPTER_ADMIN' ? serverChapterId : null,
    enabled: isAdmin,
  });
  const myPmLabel = `${myInfo?.nickname ?? ''}/${myInfo?.name ?? ''} · ${formatSchoolName(myInfo?.schoolName)}`;

  // 서버에 이미 반영된 내용. 저장이 중간에 실패해도 이어서 저장하도록 화면이 들고 있음
  const serverState = useRef(createServerProjectState());

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProjectDraft>(createInitialDraft);
  const [dirty, setDirty] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resumeAnswered, setResumeAnswered] = useState(false);

  const editInitialized = useRef(false);

  // 수정 모드: 기존 프로젝트 데이터 로드 후 draft · serverState 초기화 (최초 1회)
  useEffect(() => {
    if (!editData || editInitialized.current) return;
    editInitialized.current = true;
    serverState.current = {
      ...createServerProjectState(),
      projectId: editData.projectId,
      mainPmId: editData.mainPmId,
      coPmId: editData.coPmId,
    };
    setDraft(editData.draft);
  }, [editData]);

  const updateDraft = (patch: Partial<ProjectDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  // 저장하지 않고 다른 페이지로 가면 확인 (새로고침 · 탭 닫기는 브라우저 기본 확인)
  const needsLeaveConfirm = dirty && hasDraftContent(draft);
  const blocker = useBlocker({
    shouldBlockFn: () => needsLeaveConfirm,
    enableBeforeUnload: needsLeaveConfirm,
    withResolver: true,
  });

  const basicComplete = isBasicInfoComplete(draft, isAdmin);
  // PM은 모집 정보를 입력하지 않으므로 운영진만 확인
  const recruitComplete = !isAdmin || isRecruitComplete(draft.recruit);

  const save = async (submit: boolean) => {
    try {
      await saveProject({
        gisuId,
        isAdmin,
        chapterId: role === 'CHAPTER_ADMIN' ? serverChapterId : null,
        draft,
        server: serverState.current,
        submit,
      });
      setDirty(false);
      return true;
    } catch (error) {
      toast.show(error instanceof ApiError ? error.message : TOAST_MESSAGE.failed, {
        color: 'error',
      });
      return false;
    }
  };

  const persistDraft = async (onSaved?: () => void) => {
    setDraftSaving(true);
    const saved = await save(false);
    setDraftSaving(false);
    if (!saved) return;
    toast.show(TOAST_MESSAGE.draftSaved);
    onSaved?.();
  };

  const handleResume = async () => {
    setResumeAnswered(true);
    try {
      const loaded = await loadDraft();
      if (!loaded) return;
      const [mainPmId, coPmId] = loaded.draft.pmIds.map(toId);
      serverState.current = {
        ...createServerProjectState(),
        projectId: loaded.projectId,
        mainPmId: mainPmId ?? null,
        coPmId: coPmId ?? null,
      };
      setDraft(loaded.draft);
      setDirty(false);
    } catch (error) {
      toast.show(error instanceof ApiError ? error.message : TOAST_MESSAGE.failed, {
        color: 'error',
      });
    }
  };

  const handleNext = () => {
    if (step === 1 && !basicComplete) {
      toast.show(TOAST_MESSAGE.incomplete, { color: 'error' });
      return;
    }
    if (step === 2 && !recruitComplete) {
      toast.show(TOAST_MESSAGE.incomplete, { color: 'error' });
      return;
    }
    // PM은 모집 정보를 입력하지 않으므로 기본 정보 다음에 바로 지원 문항으로 감
    setStep((prev) => (prev === 1 && !isAdmin ? RECRUIT_STEP + 1 : prev + 1));
  };

  const handlePrev = () =>
    setStep((prev) => (prev === RECRUIT_STEP + 1 && !isAdmin ? 1 : prev - 1));

  const handleSubmit = async () => {
    if (!basicComplete || !recruitComplete) {
      toast.show(TOAST_MESSAGE.incomplete, { color: 'error' });
      return;
    }
    if (!isQuestionsComplete(draft)) {
      toast.show(TOAST_MESSAGE.sectionIncomplete, { color: 'error' });
      return;
    }
    setSubmitting(true);
    // 수정 모드: 이미 제출된 프로젝트이므로 업데이트만 (재제출 금지)
    const submitted = await save(!isEditMode);
    setSubmitting(false);
    if (!submitted) return;
    toast.show(isEditMode ? '프로젝트가 수정되었어요' : TOAST_MESSAGE.registered);
    window.setTimeout(onComplete, 0);
  };

  const busy = draftSaving || submitting || isEditLoading;

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1158px]"
        breadcrumbs={BREADCRUMBS}
        title={isEditMode ? '프로젝트 수정' : '프로젝트 등록'}
        description="내 프로젝트에 대한 정보를 등록하고 모집 폼을 작성해요."
      />
      <div className="flex w-full max-w-[1158px] flex-col gap-8">
        {/* 지나온 단계는 탭을 눌러 돌아갈 수 있음. PM은 모집 정보를 건너뛰어도 탭으로 들어가 조회할 수 있음 */}
        <div
          onClick={(event) => {
            const item = (event.target as HTMLElement).closest('li');
            if (!item || busy) return;
            const target = Array.from(item.parentElement?.children ?? []).indexOf(item) + 1;
            if (target < step || (!isAdmin && target === RECRUIT_STEP)) setStep(target);
          }}
        >
          <StepNavigation
            className="step-navigation-neutral"
            steps={STEPS.map((label) => (
              <button key={label} type="button" className="cursor-pointer text-left">
                {label}
              </button>
            ))}
            currentStep={step}
            aria-label="프로젝트 등록 단계"
          />
        </div>
        <div className="flex flex-col gap-8 rounded-xl border border-teal-grey-100 bg-white px-[29px] py-[33px] shadow-drop-neutral-3">
          {step === 1 && (
            <BasicInfoStep
              draft={draft}
              onChange={updateDraft}
              pmCandidates={isAdmin ? pmCandidates : null}
              myPmLabel={myPmLabel}
              onThumbnailReject={() =>
                toast.show(TOAST_MESSAGE.thumbnailRejected, { color: 'error' })
              }
              onLogoReject={() => toast.show(TOAST_MESSAGE.logoRejected, { color: 'error' })}
            />
          )}
          {step === 2 && (
            <RecruitInfoStep
              recruit={draft.recruit}
              onChange={(recruit) => updateDraft({ recruit })}
              editable={isAdmin}
            />
          )}
          {step === 3 && (
            <QuestionStep
              draft={draft}
              onChange={updateDraft}
              onQuestionDeleted={(undo) =>
                toast.show('질문을 삭제했어요', {
                  color: 'neutral',
                  action: { label: '되돌리기', onClick: undo },
                })
              }
              pePlatformLabel={
                draft.recruit.pePlatform
                  ? PE_PLATFORM_LABEL[draft.recruit.pePlatform]
                  : 'Web/Mobile'
              }
            />
          )}

          <div className="flex items-center justify-between">
            {/* 피그마 버튼 플로우: 처음 비활성 → 입력하면 활성 → 누르면 로딩 → 저장 완료(비활성) */}
            <Button
              variant="weak"
              color="neutral"
              disabled={!dirty || !hasDraftContent(draft) || submitting}
              isLoading={draftSaving}
              onClick={() => void persistDraft()}
            >
              임시 저장
            </Button>
            <div className="flex items-center gap-4">
              {step > 1 && (
                <Button variant="weak" color="neutral" disabled={busy} onClick={handlePrev}>
                  이전
                </Button>
              )}
              {step < STEPS.length ? (
                <Button disabled={busy} onClick={handleNext}>
                  다음
                </Button>
              ) : (
                <Button
                  isLoading={submitting}
                  disabled={draftSaving}
                  onClick={() => void handleSubmit()}
                >
                  {isEditMode ? '수정 완료' : '프로젝트 등록하기'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 수정 모드가 아닐 때만: 임시 저장된 프로젝트가 있으면 처음 들어올 때 이어서 쓸지 물어봄 */}
      <Dialog
        className="dialog-flat"
        open={!isEditMode && hasDraft && !resumeAnswered}
        onOpenChange={(open) => !open && setResumeAnswered(true)}
        title="임시 저장된 프로젝트를 이어서 작성할까요?"
        description="이미 작성 중이던 프로젝트가 있어요."
        cancelLabel="새로 만들기"
        onCancel={() => setResumeAnswered(true)}
        confirmLabel="이어서 작성하기"
        onConfirm={() => void handleResume()}
      />
      {/* 피그마: 작성 중에 나가려고 하면 저장 여부를 물어봄 */}
      <Dialog
        className="dialog-flat"
        open={blocker.status === 'blocked'}
        onOpenChange={(open) => !open && blocker.reset?.()}
        title="작성 중인 프로젝트를 저장할까요?"
        description="내용을 저장하면 나중에 이어서 작성할 수 있어요."
        cancelLabel="저장 안함"
        onCancel={() => blocker.proceed?.()}
        confirmLabel="저장 후 나가기"
        onConfirm={() => void persistDraft(() => blocker.proceed?.())}
      />
    </main>
  );
};

export default ProjectRegisterPage;
