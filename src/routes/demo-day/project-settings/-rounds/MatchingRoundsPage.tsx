import { useBlocker } from '@tanstack/react-router';
import { CheckPictogram, WarningTriangleIcon } from '@umc-product/icons';
import { Button, Dialog, PageHeader, SectionHeader, SegmentedControl } from '@umc-product/react';
import { useState } from 'react';

import { useChapters } from '@/entities/chapter';
import { useMatchingScheduleAccess, useSessionStore } from '@/entities/session';
import {
  AnnouncementTimeField,
  calculateSchedule,
  isAnnounceTimeAllowed,
  isScheduleLocked,
  isValidTime,
  type MatchingScheduleSetting,
  type MatchingTrack,
  MIN_ANNOUNCE_TIME,
  OverallScheduleField,
  parseDate,
  RoundPeriodField,
  ScheduleCalendar,
  ScheduleChapterField,
  type ScheduleRound,
  toScheduleByTrack,
  useMatchingRounds,
  useSaveMatchingSchedule,
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
  // TODO: 피그마 토스트 케이스에 없는 문구. 기획 확인 필요
  announceTooEarly: `매칭 결과발표는 ${MIN_ANNOUNCE_TIME} 이후로 설정해 주세요`,
};

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

const EMPTY_SETTING: MatchingScheduleSetting = { startDate: null, announceTime: null };

// 고친 값과 고치기 전 값을 같이 둠 (다른 지부 일정을 다시 불러오지 않고도 저장 안 한 변경을 알 수 있게)
type Draft = { base: MatchingScheduleSetting; value: MatchingScheduleSetting };

const toKey = (chapterId: number, track: MatchingTrack) => `${chapterId}-${track}`;

const isSameSetting = (left: MatchingScheduleSetting, right: MatchingScheduleSetting) =>
  left.startDate === right.startDate && left.announceTime === right.announceTime;

// 다 입력했는데 올바르지 않은 값만 에러로 표시 (입력 중에는 표시하지 않음)
const isInvalidDate = (value: string | null) => value?.length === 10 && !parseDate(value);
const isInvalidTime = (value: string | null) => value?.length === 5 && !isValidTime(value);

// 피그마 매칭 차수 설정: Plan - Design / Plan - PE 탭 + 01 기본 매칭 일정 + 02 차수별 일정 설정
const MatchingRoundsPage = () => {
  const ownChapterId = useSessionStore((state) => state.session.serverChapterId);
  const { chapterScope, editable } = useMatchingScheduleAccess();
  const toast = useAppToast();
  const [now] = useState(() => new Date());

  const gisuId = useSessionStore((state) => state.session.gisuId);
  const { data: chapters = [], isError: chaptersError } = useChapters(gisuId);

  // 고르기 전: 지부장은 소속 지부, 전 지부를 보는 역할(총괄단 · 슈퍼어드민 · 중앙 운영진)은 첫 지부
  const defaultChapterId = chapterScope === 'OWN' ? ownChapterId : (chapters[0]?.id ?? null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const chapterId = selectedChapterId ?? defaultChapterId;
  const [track, setTrack] = useState<MatchingTrack>('PLAN_DESIGN');

  const rounds = useMatchingRounds(chapterId ?? undefined);
  const serverSchedules = rounds.data ? toScheduleByTrack(rounds.data) : null;
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const save = useSaveMatchingSchedule();

  // 저장 완료 후 다시 고치기 전까지 버튼을 '저장 완료'로 둠 (피그마 버튼 플로우)
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [savedDialogOpen, setSavedDialogOpen] = useState(false);

  const currentKey = chapterId === null ? null : toKey(chapterId, track);
  const savedSetting = serverSchedules?.[track].setting ?? EMPTY_SETTING;
  const draft = (currentKey !== null ? drafts[currentKey]?.value : undefined) ?? savedSetting;
  const dirty = !isSameSetting(draft, savedSetting);
  // 서버 일정 그대로면 서버 값을 보여 주고, 고치는 중이면 시작일로 계산
  const schedule =
    !dirty && serverSchedules ? serverSchedules[track].schedule : calculateSchedule(draft);
  // 일정을 불러온 뒤에만 수정 가능. 1차 매칭이 시작되면 일정을 바꿀 수 없음 (저장된 일정 기준)
  const canEdit = editable && rounds.isSuccess && !isScheduleLocked(savedSetting, now);
  const saving =
    save.isPending && save.variables?.chapterId === chapterId && save.variables.track === track;
  const showSaved = savedKey === currentKey && !dirty;

  // 저장하지 않고 다른 페이지로 가면 확인 (새로고침 · 탭 닫기는 브라우저 기본 확인)
  const unsaved = Object.values(drafts).some(({ base, value }) => !isSameSetting(base, value));
  const blocker = useBlocker({
    shouldBlockFn: () => unsaved,
    enableBeforeUnload: unsaved,
    withResolver: true,
  });

  const updateDraft = (patch: Partial<MatchingScheduleSetting>) => {
    if (currentKey === null) return;
    setDrafts((prev) => {
      const current = prev[currentKey];
      return {
        ...prev,
        [currentKey]: {
          base: current?.base ?? savedSetting,
          value: { ...(current?.value ?? savedSetting), ...patch },
        },
      };
    });
  };

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
    if (!isAnnounceTimeAllowed(draft.announceTime)) {
      toast.show(TOAST_MESSAGE.announceTooEarly, { color: 'error' });
      return;
    }
    if (chapterId === null || currentKey === null || !rounds.data) return;

    const key = currentKey;
    save.mutate(
      { chapterId, track, setting: draft, existingRounds: rounds.data },
      {
        // 저장한 일정을 다시 불러온 뒤라 고친 값을 지워도 저장한 값이 보임
        onSuccess: () => {
          setDrafts(({ [key]: _saved, ...rest }) => rest);
          setSavedKey(key);
          setSavedDialogOpen(true);
          toast.show(TOAST_MESSAGE.saved);
        },
        onError: (error) => toast.show(error.message, { color: 'error' }),
      },
    );
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
                {/* TODO: 불러오기 실패 화면이 피그마에 나오면 교체 */}
                {(chaptersError || rounds.isError) && (
                  <p role="alert" className="text-body-3-medium text-red-500">
                    매칭 일정을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
                  </p>
                )}
                <ScheduleChapterField
                  chapters={chapters}
                  value={chapterId}
                  onValueChange={setSelectedChapterId}
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
              {/* 달력 옆에 자리가 없으면 차수별 기간을 달력 아래로 내림 */}
              <div className="flex flex-wrap items-start gap-10 pl-4">
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
