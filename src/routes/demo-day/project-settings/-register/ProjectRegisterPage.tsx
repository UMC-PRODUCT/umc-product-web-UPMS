import { useBlocker } from '@tanstack/react-router';
import { Button, Dialog, PageHeader, StepNavigation } from '@umc-product/react';
import { useState } from 'react';

import { useProjectRegisterAccess, useSessionStore } from '@/entities/session';
import {
  BasicInfoStep,
  createInitialDraft,
  fromSavedDraft,
  hasDraftContent,
  isBasicInfoComplete,
  isQuestionsComplete,
  isRecruitComplete,
  MOCK_ADMIN_RECRUIT,
  MOCK_MY_PM,
  MOCK_PM_CANDIDATES,
  type PePlatform,
  type ProjectDraft,
  QuestionStep,
  RecruitInfoStep,
  toSavedDraft,
  useProjectDraftStore,
} from '@/features/project-register';
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
};

// TODO: 임시 저장 · 프로젝트 등록 API 연동 후 제거 (저장 중 버튼 로딩 확인용)
const MOCK_REQUEST_DELAY = 600;

const PE_PLATFORM_LABEL: Record<PePlatform, string> = { WEB: 'Web', MOBILE: 'Mobile' };

type ProjectRegisterPageProps = {
  onComplete: () => void; // 등록한 뒤 목록으로
};

// 피그마 프로젝트 등록: 1 기본 정보 → 2 모집 정보 → 3 지원 문항
// 운영진(마스터 · 지부장)은 PM을 골라 등록하고 모집 정보도 입력, PM은 본인 정보가 채워진 채 모집 정보를 조회만 함
// 단계 번호: 1 기본 정보 · 2 모집 정보 · 3 지원 문항
const RECRUIT_STEP = 2;

const ProjectRegisterPage = ({ onComplete }: ProjectRegisterPageProps) => {
  const toast = useAppToast();
  const access = useProjectRegisterAccess();
  const { role, chapterId } = useSessionStore((state) => state.session);
  const savedDraft = useProjectDraftStore((state) => state.saved);
  const saveDraft = useProjectDraftStore((state) => state.save);
  const clearDraft = useProjectDraftStore((state) => state.clear);

  const isAdmin = access === 'ADMIN';
  // 지부장은 본인 지부 PM만 고를 수 있음
  const pmCandidates = isAdmin
    ? role === 'CHAPTER_ADMIN'
      ? MOCK_PM_CANDIDATES.filter((candidate) => candidate.chapterId === chapterId)
      : MOCK_PM_CANDIDATES
    : null;
  const myPmLabel = `${MOCK_MY_PM.nickname}/${MOCK_MY_PM.name} · ${MOCK_MY_PM.schoolName}`;

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProjectDraft>(() => ({
    ...createInitialDraft(),
    recruit: isAdmin
      ? createInitialDraft().recruit
      : (MOCK_ADMIN_RECRUIT ?? createInitialDraft().recruit),
  }));
  const [dirty, setDirty] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(savedDraft !== null);

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

  const persistDraft = (onSaved?: () => void) => {
    // TODO: 임시 저장 API 연동. 지금은 화면 안에서만 저장 (이미지 파일은 저장되지 않음)
    setDraftSaving(true);
    window.setTimeout(() => {
      saveDraft(toSavedDraft(draft));
      setDirty(false);
      setDraftSaving(false);
      toast.show(TOAST_MESSAGE.draftSaved);
      onSaved?.();
    }, MOCK_REQUEST_DELAY);
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

  const handleSubmit = () => {
    if (!basicComplete || !recruitComplete) {
      toast.show(TOAST_MESSAGE.incomplete, { color: 'error' });
      return;
    }
    if (!isQuestionsComplete(draft)) {
      toast.show(TOAST_MESSAGE.sectionIncomplete, { color: 'error' });
      return;
    }
    // TODO: 프로젝트 등록 API 연동 (썸네일 · 로고 업로드 포함). 지금은 화면에서만 등록
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDirty(false);
      clearDraft();
      toast.show(TOAST_MESSAGE.registered);
      // 이동 차단이 풀린 뒤에 목록으로 이동
      window.setTimeout(onComplete, 0);
    }, MOCK_REQUEST_DELAY);
  };

  const busy = draftSaving || submitting;

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1158px]"
        breadcrumbs={BREADCRUMBS}
        title="프로젝트 등록"
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
              pmCandidates={pmCandidates}
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
              disabled={!dirty || !hasDraftContent(draft)}
              isLoading={draftSaving}
              onClick={() => persistDraft()}
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
                <Button isLoading={submitting} disabled={draftSaving} onClick={handleSubmit}>
                  프로젝트 등록하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 피그마: 임시 저장된 프로젝트가 있으면 처음 들어올 때 이어서 쓸지 물어봄 */}
      <Dialog
        className="dialog-flat"
        open={resumeDialogOpen}
        onOpenChange={setResumeDialogOpen}
        title="임시 저장된 프로젝트를 이어서 작성할까요?"
        description="이미 작성 중이던 프로젝트가 있어요."
        cancelLabel="새로 만들기"
        onCancel={() => {
          clearDraft();
          setResumeDialogOpen(false);
        }}
        confirmLabel="이어서 작성하기"
        onConfirm={() => {
          if (savedDraft) setDraft(fromSavedDraft(savedDraft));
          setResumeDialogOpen(false);
        }}
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
        onConfirm={() => persistDraft(() => blocker.proceed?.())}
      />
    </main>
  );
};

export default ProjectRegisterPage;
