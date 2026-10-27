import { ResetIcon } from '@umc-product/icons';
import { Button, PageHeader, SectionHeader, Select, type SelectOption } from '@umc-product/react';
import { useRef, useState } from 'react';

import { MOCK_CHAPTERS } from '@/entities/chapter';
import { useProjectSettingsAccess } from '@/entities/session';
import { ChapterSelectHeader, useResolvedChapterId } from '@/features/chapter-select';
import SearchBar from '@/widgets/searchBar/SearchBar';
import { useAppToast } from '@/widgets/toast';

import { MOCK_CHAPTER_QUOTAS, MOCK_QUOTA_TEAMS } from './mock';
import PartStatCard from './PartStatCard';
import QuotaTableFooter from './QuotaTableFooter';
import QuotaTableRow from './QuotaTableRow';
import { type DraftValues, type Part, PART_LABEL, PARTS } from './types';

const BREADCRUMBS = [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '프로젝트 설정', href: '/demo-day/project-settings/notice' },
  { label: '프로젝트 TO 관리' },
];

const initDraft = (teams: typeof MOCK_QUOTA_TEAMS): DraftValues =>
  Object.fromEntries(
    teams.map((t) => [
      t.teamId,
      { pm: t.pm, design: t.design, webPe: t.webPe, mobilePe: t.mobilePe },
    ]),
  );

const QuotaPage = () => {
  const isMatchingPeriod = false; // TODO: API
  const canEdit = useProjectSettingsAccess() === 'FULL'; // 지부장 이상만 수정 가능

  // 지부 선택
  const chapterId = useResolvedChapterId();
  const [selectedChapterId, setSelectedChapterId] = useState(chapterId);
  const chapterTeams = MOCK_QUOTA_TEAMS.filter((t) => t.chapterId === selectedChapterId);
  const chapterName = MOCK_CHAPTERS.find((c) => c.id === selectedChapterId)?.name ?? '지부';

  // 테이블 편집 상태
  const [saved, setSaved] = useState<DraftValues>(() => initDraft(MOCK_QUOTA_TEAMS));
  const [draft, setDraft] = useState<DraftValues>(() => initDraft(MOCK_QUOTA_TEAMS));
  const [editingCell, setEditingCell] = useState<{ teamId: string; part: Part } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toast = useAppToast();

  // 검색 및 필터
  const [search, setSearch] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const universityOptions: SelectOption[] = [...new Set(chapterTeams.map((t) => t.university))]
    .sort()
    .map((u) => ({ value: u, label: u }));
  const filteredTeams = chapterTeams.filter((t) => {
    const matchesSearch = search === '' || t.teamName.includes(search);
    const matchesUniversity = universityFilter === '' || t.university === universityFilter;
    return matchesSearch && matchesUniversity;
  });

  // 집계
  const partTotal = (part: Part) =>
    chapterTeams.reduce((sum, t) => sum + (draft[t.teamId]?.[part] ?? 0), 0);
  const chapterQuota = MOCK_CHAPTER_QUOTAS.find((q) => q.chapterId === selectedChapterId);
  const partQuota = (part: Part) => chapterQuota?.[part] ?? 0; // 지부 파트별 고정 정원

  const handleCellClick = (teamId: string, part: Part, disabled: boolean) => {
    if (!canEdit || isMatchingPeriod || disabled) return;
    setEditingCell({ teamId, part });
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleCellChange = (teamId: string, part: Part, value: string) => {
    const num = parseInt(value, 10);
    setDraft((prev) => ({
      ...prev,
      [teamId]: { ...prev[teamId], [part]: isNaN(num) || num < 0 ? 0 : num },
    }));
  };

  const handleCellBlur = () => setEditingCell(null);

  const handleReset = () => {
    setDraft(saved);
    setEditingCell(null);
    setUniversityFilter('');
  };

  const handleSave = () => {
    const totalDiff = PARTS.reduce((sum, p) => sum + partTotal(p) - partQuota(p), 0);
    setSaved(draft);
    setEditingCell(null);
    if (totalDiff < 0) {
      toast.show('전체 정원보다 배정 인원이 부족해요.', { color: 'error' });
    } else if (totalDiff > 0) {
      toast.show('전체 정원보다 배정 인원이 많아요.', { color: 'error' });
    } else {
      toast.show('저장되었어요.');
    }
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1082px]"
        breadcrumbs={BREADCRUMBS}
        title="프로젝트 TO 관리"
        description="지부 별 전체 프로젝트 TO를 한번에 관리할 수 있어요."
      />

      <div className="flex w-full max-w-[1082px] flex-col">
        <ChapterSelectHeader value={selectedChapterId} onValueChange={setSelectedChapterId} />

        <section className="mt-8 flex flex-col">
          <SectionHeader title="파트별 인원 현황" />
          <div className="mt-3 flex gap-2.5">
            {PARTS.map((part) => (
              <PartStatCard key={part} title={PART_LABEL[part]} count={partTotal(part)} />
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
                options={universityOptions}
                value={universityFilter || null}
                onValueChange={(value) => setUniversityFilter(value ?? '')}
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

              <Button size="sm" disabled={isMatchingPeriod || !canEdit} onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-teal-grey-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="flex bg-teal-grey-100">
                  <th className="flex w-[170px] shrink-0 flex-col items-center justify-center gap-1 border border-t-0 border-l-0 border-teal-300 bg-teal-50">
                    <span className="text-heading-3-semibold leading-[1.4] tracking-[-0.4px] text-teal-600">
                      {chapterName} 지부
                    </span>
                    <span className="text-body-2-medium leading-normal tracking-[-0.15px] text-teal-grey-500">
                      총 {chapterTeams.length}개 팀
                    </span>
                  </th>
                  {PARTS.map((part) => (
                    <th
                      key={part}
                      className="flex w-[186.75px] shrink-0 flex-col items-center justify-center gap-1 border-b-2 border-teal-500 bg-teal-50 pt-3 pb-4"
                    >
                      <span className="text-title-2-semibold leading-[1.4] tracking-[-0.2px] text-neutral-strong-800">
                        {PART_LABEL[part]}
                      </span>
                      <span className="text-heading-4-semibold leading-[1.4] tracking-[-0.36px] text-teal-600">
                        {partTotal(part)}명
                      </span>
                    </th>
                  ))}
                  <th className="flex flex-1 flex-col items-center justify-center border border-t-0 border-r-0 border-teal-grey-300 bg-fill-neutral-medium-100 pt-3 pb-4">
                    <span className="text-[20px] leading-[1.4] font-semibold tracking-[-0.2px] whitespace-nowrap text-teal-grey-800">
                      합계 인원
                    </span>
                  </th>
                </tr>
              </thead>
            </table>

            <div className="max-h-[510px] scrollbar-none overflow-y-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {filteredTeams.map((team) => (
                    <QuotaTableRow
                      key={team.teamId}
                      team={team}
                      values={draft[team.teamId]}
                      editingCell={editingCell}
                      inputRef={inputRef}
                      isMatchingPeriod={isMatchingPeriod}
                      canEdit={canEdit}
                      onCellClick={handleCellClick}
                      onCellChange={handleCellChange}
                      onCellBlur={handleCellBlur}
                    />
                  ))}
                </tbody>
              </table>

              {filteredTeams.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-[74px] text-teal-grey-600">
                  <h3 className="text-body-1-semibold">검색 결과가 없어요</h3>
                  <p className="text-body-3-regular">프로젝트명을 확인하고 다시 검색해 보세요.</p>
                </div>
              )}
            </div>

            <QuotaTableFooter partTotal={partTotal} partQuota={partQuota} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default QuotaPage;
