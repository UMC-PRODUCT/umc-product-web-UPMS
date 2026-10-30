import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ResetIcon } from '@umc-product/icons';
import {
  Button,
  PageHeader,
  SectionHeader,
  SegmentedControl,
  Select,
  type SelectOption,
} from '@umc-product/react';
import { useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { useChapters } from '@/entities/chapter';
import { useProjectSettingsAccess, useSessionStore } from '@/entities/session';
import { cn } from '@/shared/lib/cn';
import SearchBar from '@/widgets/searchBar/SearchBar';
import { useAppToast } from '@/widgets/toast';

import type { ProjectRow } from './api/getPartQuotas';
import { partQuotasQueryOptions } from './api/partQuotasQuery';
import { savePartQuotas, type SavePartQuotasRequest } from './api/savePartQuotas';
import PartStatCard from './PartStatCard';
import QuotaTableFooter from './QuotaTableFooter';
import QuotaTableRow from './QuotaTableRow';
import type { DraftValues } from './types';

const BREADCRUMBS = [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '프로젝트 설정', href: '/demo-day/project-settings/notice' },
  { label: '프로젝트 TO 관리' },
];

const initDraftFromProjects = (projects: ProjectRow[]): DraftValues =>
  Object.fromEntries(
    projects.map((p) => [
      String(p.projectId!),
      Object.fromEntries((p.cells ?? []).map((c) => [c.part!, Number(c.quota ?? 0)])),
    ]),
  );

const QuotaPage = () => {
  const canEdit = useProjectSettingsAccess() === 'FULL';
  const gisuId = useSessionStore((s) => s.session.gisuId);
  const serverChapterId = useSessionStore((s) => s.session.serverChapterId);

  // 지부 선택
  const [selectedChapterId, setSelectedChapterId] = useState<number | undefined>(
    serverChapterId ?? undefined,
  );

  // 검색 및 필터
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [schoolId, setSchoolId] = useState<number | undefined>(undefined);

  const { data: chaptersData } = useChapters(gisuId ?? null);

  const { data, isError } = useQuery(
    partQuotasQueryOptions({
      gisuId: gisuId ?? 0,
      chapterId: selectedChapterId,
      keyword: debouncedSearch || undefined,
      schoolId,
    }),
  );

  const columns = data?.columns ?? [];
  const projects = data?.projects ?? [];
  const allColumnsLocked =
    columns.length > 0 && columns.every((col) => col.canEdit?.allowed === false);

  // 테이블 편집 상태
  const [prevChapterId, setPrevChapterId] = useState<number | undefined>(undefined);
  const [saved, setSaved] = useState<DraftValues>({});
  const [draft, setDraft] = useState<DraftValues>({});
  const [editingCell, setEditingCell] = useState<{ projectId: string; part: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toast = useAppToast();
  const queryClient = useQueryClient();

  const { mutate: saveMutate, isPending: isSaving } = useMutation({
    mutationFn: ({ isUnder: _, ...body }: SavePartQuotasRequest & { isUnder: boolean }) =>
      savePartQuotas(body),
    onSuccess: (_, { isUnder }) => {
      setSaved(draft);
      setEditingCell(null);
      toast.show(isUnder ? '정해진 인원보다 적게 배정되었어요' : '저장되었어요');
      queryClient.invalidateQueries({ queryKey: ['part-quotas'] });
    },
    onError: (error: Error) => {
      toast.show(error.message, { color: 'error' });
    },
  });

  // 지부 바뀔 때 draft 초기화 (render phase state update 패턴)
  if (data?.chapterId !== undefined && data.chapterId !== prevChapterId) {
    setPrevChapterId(data.chapterId);
    const initial = initDraftFromProjects(data.projects ?? []);
    setSaved(initial);
    setDraft(initial);
  }

  const schoolOptions: SelectOption[] = (data?.schools ?? []).map((s) => ({
    value: String(s.schoolId!),
    label: s.schoolName ?? '',
  }));

  // 집계
  const partTotal = (part: string) =>
    projects.reduce((sum, p) => sum + (draft[String(p.projectId!)]?.[part] ?? 0), 0);
  const partTotalAll = (part: string) =>
    Number(data?.summary?.find((s) => s.part === part)?.allocatedQuota ?? 0);
  const partQuota = (part: string) =>
    Number(data?.filteredSummary?.find((s) => s.part === part)?.availableCount ?? 0);

  const handleCellClick = (projectId: string, part: string, disabled: boolean) => {
    const isLocked = columns.find((c) => c.part === part)?.canEdit?.allowed === false;
    if (!canEdit || isLocked || disabled) return;
    setEditingCell({ projectId, part });
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleCellChange = (projectId: string, part: string, value: string) => {
    const num = parseInt(value, 10);
    setDraft((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], [part]: isNaN(num) || num < 0 ? 0 : num },
    }));
  };

  const handleCellBlur = () => setEditingCell(null);

  const handleReset = () => {
    setDraft(saved);
    setEditingCell(null);
    setSchoolId(undefined);
  };

  const handleSave = () => {
    if (!data?.chapterId) return;

    const isPartOver = columns.some((col) => partTotal(col.part!) > partQuota(col.part!));
    if (isPartOver) {
      toast.show('정해진 인원보다 많이 배정되었어요', { color: 'error' });
      return;
    }

    const isUnder = columns
      .filter((col) => col.canEdit?.allowed === true)
      .some((col) => partTotal(col.part!) < partQuota(col.part!));

    type CellPart = SavePartQuotasRequest['projects'][0]['entries'][0]['part'];

    const changedProjects = Object.entries(draft)
      .map(([projectId, parts]) => {
        const savedParts = saved[projectId] ?? {};
        const entries = Object.entries(parts)
          .filter(([part, quota]) => quota !== savedParts[part])
          .map(([part, quota]) => ({ part: part as CellPart, quota }));
        return entries.length > 0 ? { projectId: Number(projectId), entries } : null;
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    if (changedProjects.length === 0) return;

    saveMutate({
      isUnder,
      gisuId: gisuId ?? 0,
      chapterId: data.chapterId,
      projects: changedProjects,
    });
  };

  const isChapterLeader = serverChapterId != null;

  const chapterItems = (chaptersData ?? []).map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1082px]"
        breadcrumbs={BREADCRUMBS}
        title="프로젝트 TO 관리"
        description="지부 별 전체 프로젝트 TO를 한번에 관리할 수 있어요."
      />

      <div className="flex w-full max-w-[1082px] flex-col">
        <SegmentedControl
          aria-label="지부 선택"
          items={chapterItems}
          value={String(selectedChapterId ?? data?.chapterId ?? '')}
          onValueChange={(v) => !isChapterLeader && setSelectedChapterId(Number(v))}
          className={cn(
            '[&_[role=radio]:not([data-checked])]:text-teal-600',
            isChapterLeader && '[&_[role=radio]:not([data-checked])]:cursor-not-allowed',
          )}
        />

        <section className="mt-8 flex flex-col">
          <SectionHeader title="파트별 인원 현황" />
          <div className="mt-3 flex gap-2.5">
            {columns.map((col) => (
              <PartStatCard
                key={col.part}
                title={col.label ?? ''}
                count={partTotalAll(col.part!)}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col">
          <div className="mt-16 flex flex-col">
            <SectionHeader title="프로젝트별 파트 TO" />
            <span className="mt-1.5 mb-6 pl-1.5 text-body-2-regular text-teal-grey-600">
              매칭이 시작되면 프로젝트TO를 수정할 수 없어요
            </span>
          </div>

          <div className="flex items-center justify-between">
            <SearchBar
              value={search}
              onValueChange={setSearch}
              placeholder="프로젝트 명으로 검색하세요"
              className="w-114"
            />

            <div className="flex items-center gap-2">
              <Select
                variant="filter"
                size="md"
                placeholder="학교"
                aria-label="학교 필터"
                options={schoolOptions}
                value={schoolId !== undefined ? String(schoolId) : null}
                onValueChange={(v) => setSchoolId(v !== null ? Number(v) : undefined)}
                className="w-auto shrink-0 [&_.umc-select\_\_trigger]:[--umc-select-placeholder-color:var(--umc-color-text-neutral-default-900)]"
              />

              <Button
                variant="fill"
                color="white"
                size="sm"
                leadingIcon={<ResetIcon size={14} />}
                onClick={handleReset}
              >
                초기화
              </Button>

              <Button size="sm" disabled={isSaving || allColumnsLocked} onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-teal-grey-200">
            <div className="overflow-x-auto">
              <table className="w-auto min-w-full border-collapse">
                <thead>
                  <tr className="flex bg-teal-grey-100">
                    <th className="flex w-[170px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 border border-t-0 border-l-0 border-teal-300 bg-teal-50">
                      <span className="text-heading-3-semibold leading-[1.4] tracking-[-0.4px] text-teal-600">
                        {data?.chapterName ?? ''} 지부
                      </span>
                      <span className="text-body-2-medium leading-normal tracking-[-0.15px] text-teal-grey-500">
                        총 {data?.totalProjectCount ?? 0}개 팀
                      </span>
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.part}
                        className="flex w-[186.75px] shrink-0 flex-col items-center justify-center gap-1 border-b-2 border-teal-500 bg-teal-50 pt-3 pb-4"
                      >
                        <span className="text-title-2-semibold leading-[1.4] tracking-[-0.2px] text-neutral-strong-800">
                          {col.label}
                        </span>
                        <span className="text-heading-4-semibold leading-[1.4] tracking-[-0.36px] text-teal-600">
                          {partTotal(col.part!)}명
                        </span>
                      </th>
                    ))}
                    <th className="flex min-w-[150px] flex-1 cursor-pointer flex-col items-center justify-center border border-t-0 border-r-0 border-teal-grey-300 bg-fill-neutral-medium-100 pt-3 pb-4">
                      <span className="text-[20px] leading-[1.4] font-semibold tracking-[-0.2px] whitespace-nowrap text-teal-grey-800">
                        합계 인원
                      </span>
                    </th>
                  </tr>
                </thead>
              </table>

              <div className="max-h-[510px] scrollbar-none overflow-y-auto">
                {isError ? (
                  <div className="flex w-full flex-col items-center justify-center gap-2 py-[74px] text-teal-grey-600">
                    <h3 className="text-body-1-semibold">데이터를 불러오지 못했어요</h3>
                    <p className="text-body-3-regular">잠시 후 다시 시도해 주세요.</p>
                  </div>
                ) : (
                  <>
                    <table className="w-auto min-w-full border-collapse">
                      <tbody>
                        {projects.map((project) => (
                          <QuotaTableRow
                            key={project.projectId}
                            project={project}
                            values={draft[String(project.projectId!)]}
                            columns={columns}
                            editingCell={editingCell}
                            inputRef={inputRef}
                            canEdit={canEdit}
                            onCellClick={handleCellClick}
                            onCellChange={handleCellChange}
                            onCellBlur={handleCellBlur}
                          />
                        ))}
                      </tbody>
                    </table>

                    {projects.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-2 py-[74px] text-teal-grey-600">
                        <h3 className="text-body-1-semibold">검색 결과가 없어요</h3>
                        <p className="text-body-3-regular">
                          프로젝트명을 확인하고 다시 검색해 보세요.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <QuotaTableFooter columns={columns} partTotal={partTotal} partQuota={partQuota} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default QuotaPage;
