import { useBlocker } from '@tanstack/react-router';
import { CheckPictogram, WarningTriangleIcon } from '@umc-product/icons';
import { Button, Dialog, PageHeader, SectionHeader, SegmentedControl } from '@umc-product/react';
import { useState } from 'react';

import { MOCK_CHAPTERS } from '@/entities/chapter';
import { useMatchingScheduleAccess, useSessionStore } from '@/entities/session';
import {
  AnnouncementTimeField,
  calculateSchedule,
  isScheduleLocked,
  isValidTime,
  type MatchingScheduleSetting,
  type MatchingTrack,
  MOCK_MATCHING_SCHEDULES,
  OverallScheduleField,
  parseDate,
  RoundPeriodField,
  ScheduleCalendar,
  ScheduleChapterField,
  type ScheduleRound,
} from '@/features/matching-schedule';
import NoticeDialog from '@/shared/ui/NoticeDialog';
import { useAppToast } from '@/widgets/toast';

const BREADCRUMBS = [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '프로젝트 설정', href: '/demo-day/project-settings/notice' },
  { label: '매칭 차수 설정' },
];

const TRACK_ITEMS: { value: MatchingTrack; label: string }[] = [
  { value: 'PLAN_DESIGN', label: 'Plan - Design 매칭' },
  { value: 'PLAN_PE', label: 'Plan-PE 매칭' },
];

// 달력 아래 일정 카드 제목
const TRACK_CARD_LABEL: Record<MatchingTrack, string> = {
  PLAN_DESIGN: 'Plan-Design',
  PLAN_PE: 'Plan-PE',
};

// 피그마 '매칭 차수 토스트 케이스 모음'
const TOAST_MESSAGE = {
  otherChapter: '다른 지부의 매칭 일정은 설정할 수 없어요',
  startDateFirst: '전체 매칭 시작일을 적어주세요',
  incomplete: '모든 일정을 입력하세요',
  saved: '매칭 차수가 저장되었어요',
};

// TODO: 매칭 일정 저장 API 연동 후 제거 (저장 중 버튼 로딩 확인용)
const MOCK_SAVE_DELAY = 600;

const ROUND_TITLE: Record<ScheduleRound, string> = {
  1: '1차 지원 기간',
  2: '2차 지원 기간',
  3: '3차 지원 기간',
  RANDOM: '랜덤 매칭 기간',
};

// 시작일 입력 전: 빈 칸으로 보여 줌
const ROUND_PLACEHOLDERS = ([1, 2, 3, 'RANDOM'] as const).map((round) => ({
  round,
  period: null,
}));

type Schedules = typeof MOCK_MATCHING_SCHEDULES;

const isSameSetting = (left: MatchingScheduleSetting, right: MatchingScheduleSetting) =>
  left.startDate === right.startDate && left.announceTime === right.announceTime;

// 저장하지 않은 지부 · 탭이 하나라도 있는지
const hasUnsavedChanges = (drafts: Schedules, saved: Schedules) =>
  Object.keys(drafts).some((chapterId) =>
    TRACK_ITEMS.some(
      ({ value }) => !isSameSetting(drafts[chapterId][value], saved[chapterId][value]),
    ),
  );

// 다 입력했는데 올바르지 않은 값만 에러로 표시 (입력 중에는 표시하지 않음)
const isInvalidDate = (value: string | null) => value?.length === 10 && !parseDate(value);
const isInvalidTime = (value: string | null) => value?.length === 5 && !isValidTime(value);

// 피그마 매칭 차수 설정: Plan - Design / Plan - PE 탭 + 01 기본 매칭 일정 + 02 차수별 일정 설정
const MatchingRoundsPage = () => {
  const ownChapterId = useSessionStore((state) => state.session.chapterId);
  const { chapterScope, editable } = useMatchingScheduleAccess();
  const toast = useAppToast();
  const [now] = useState(() => new Date());

  const [chapterId, setChapterId] = useState(
    () => MOCK_CHAPTERS.find(({ id }) => id === ownChapterId)?.id ?? MOCK_CHAPTERS[0].id,
  );
  const [track, setTrack] = useState<MatchingTrack>('PLAN_DESIGN');
  // TODO: 매칭 일정 API 연동. 지금은 화면에서만 저장
  const [saved, setSaved] = useState<Schedules>(MOCK_MATCHING_SCHEDULES);
  const [drafts, setDrafts] = useState<Schedules>(MOCK_MATCHING_SCHEDULES);

  // 저장 완료 후 다시 고치기 전까지 버튼을 '저장 완료'로 둠 (피그마 버튼 플로우)
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [savedDialogOpen, setSavedDialogOpen] = useState(false);

  const currentKey = `${chapterId}-${track}`;
  const savedSetting = saved[chapterId][track];
  const draft = drafts[chapterId][track];
  const schedule = calculateSchedule(draft);
  // 1차 매칭이 시작되면 일정을 바꿀 수 없음 (저장된 일정 기준)
  const canEdit = editable && !isScheduleLocked(savedSetting, now);
  const dirty = !isSameSetting(draft, savedSetting);
  const saving = savingKey === currentKey;
  const showSaved = savedKey === currentKey && !dirty;

  // 저장하지 않고 다른 페이지로 가면 확인 (새로고침 · 탭 닫기는 브라우저 기본 확인)
  const unsaved = hasUnsavedChanges(drafts, saved);
  const blocker = useBlocker({
    shouldBlockFn: () => unsaved,
    enableBeforeUnload: unsaved,
    withResolver: true,
  });

  const updateDraft = (patch: Partial<MatchingScheduleSetting>) =>
    setDrafts((prev) => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], [track]: { ...prev[chapterId][track], ...patch } },
    }));

  // 자동 계산 칸은 시작일을 넣어야 채워짐
  const handleDisabledFieldClick = () => {
    if (canEdit && !parseDate(draft.startDate)) {
      toast.show(TOAST_MESSAGE.startDateFirst, { color: 'error' });
    }
  };

  const handleSave = () => {
    if (!parseDate(draft.startDate) || !isValidTime(draft.announceTime)) {
      toast.show(TOAST_MESSAGE.incomplete, { color: 'error' });
      return;
    }
    // TODO: 매칭 일정 저장 API 연동. 지금은 화면에서만 저장
    const key = currentKey;
    const setting = draft;
    setSavingKey(key);
    window.setTimeout(() => {
      setSaved((prev) => ({ ...prev, [chapterId]: { ...prev[chapterId], [track]: setting } }));
      setSavingKey(null);
      setSavedKey(key);
      setSavedDialogOpen(true);
      toast.show(TOAST_MESSAGE.saved);
    }, MOCK_SAVE_DELAY);
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1082px]"
        breadcrumbs={BREADCRUMBS}
        title="매칭 차수 설정"
        description={
          editable
            ? '지부별 매칭 일정과 차수별 지원 기간을 설정해요. 1차 매칭이 시작되면 매칭 일정을 변경할 수 없어요.'
            : '지부별 매칭 일정을 확인 할 수 있어요.'
        }
      />
      <div className="flex w-full max-w-[1079px] flex-col gap-3">
        <SegmentedControl
          aria-label="매칭 구분"
          items={TRACK_ITEMS}
          value={track}
          onValueChange={setTrack}
          // 디자인상 선택되지 않은 탭은 브랜드 색 텍스트
          className="[&_[role=radio]:not([data-checked])]:text-teal-600"
        />
        <div className="flex flex-col gap-8 rounded-xl border border-teal-grey-100 bg-white px-[29px] py-[33px] shadow-drop-neutral-3">
          <div className="flex flex-col gap-[72px]">
            <section className="flex flex-col gap-4">
              <SectionHeader number="01" title="기본 매칭 일정" />
              <div className="flex flex-col gap-[22px] pl-[34px]">
                <ScheduleChapterField
                  chapters={MOCK_CHAPTERS}
                  value={chapterId}
                  onValueChange={setChapterId}
                  onlyChapterId={chapterScope === 'OWN' ? ownChapterId : undefined}
                  onBlockedClick={() => toast.show(TOAST_MESSAGE.otherChapter, { color: 'error' })}
                />
                <div className="flex flex-col gap-5">
                  <OverallScheduleField
                    startDate={draft.startDate ?? ''}
                    onStartDateChange={
                      canEdit ? (startDate) => updateDraft({ startDate }) : undefined
                    }
                    endDate={schedule?.overall.end.date ?? null}
                    invalid={isInvalidDate(draft.startDate)}
                    onDisabledClick={handleDisabledFieldClick}
                  />
                  <AnnouncementTimeField
                    value={draft.announceTime ?? ''}
                    onValueChange={
                      canEdit ? (announceTime) => updateDraft({ announceTime }) : undefined
                    }
                    invalid={isInvalidTime(draft.announceTime)}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <SectionHeader number="02" title="차수별 일정 설정" />
              <div className="flex items-start gap-10 pl-4">
                <ScheduleCalendar
                  // 시작일이 바뀌면 달력도 그 달로 이동
                  key={`${chapterId}-${track}-${schedule?.overall.start.date ?? ''}`}
                  schedule={schedule}
                  trackLabel={TRACK_CARD_LABEL[track]}
                  now={now}
                />
                <div className="flex flex-col gap-[27px] pt-3">
                  {(schedule?.rounds ?? ROUND_PLACEHOLDERS).map(({ round, period }) => (
                    <RoundPeriodField
                      key={round}
                      title={ROUND_TITLE[round]}
                      period={period}
                      endPlaceholder={round === 'RANDOM' ? '20:00' : undefined}
                      onDisabledClick={handleDisabledFieldClick}
                      guidance={
                        round === 'RANDOM'
                          ? '최종 발표 전, 운영진이 빈자리와 미배정 인원을 조정하는 기간이에요.'
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
          {canEdit && (
            <div className="flex justify-end">
              {/* 피그마 버튼 플로우: 처음 비활성 → 고치면 활성 → 누르면 로딩 → 저장 완료(비활성) */}
              <Button
                size="sm"
                className="h-11 w-[92px]"
                disabled={!dirty && !saving}
                isLoading={saving}
                onClick={handleSave}
              >
                {showSaved ? '저장 완료' : '저장하기'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <NoticeDialog
        open={savedDialogOpen}
        onConfirm={() => setSavedDialogOpen(false)}
        icon={<CheckPictogram size={24} />}
        title="저장 완료"
        description="매칭 차수 설정이 저장됐어요"
      />
      <Dialog
        open={blocker.status === 'blocked'}
        onOpenChange={(open) => !open && blocker.reset?.()}
        color="error"
        icon={<WarningTriangleIcon weight="fill" size={24} className="text-red-500" />}
        title="페이지를 나갈까요?"
        description="작성 중인 내용이 저장되지 않아요."
        cancelLabel="돌아가기"
        onCancel={() => blocker.reset?.()}
        confirmLabel="나가기"
        onConfirm={() => blocker.proceed?.()}
      />
    </main>
  );
};

export default MatchingRoundsPage;
