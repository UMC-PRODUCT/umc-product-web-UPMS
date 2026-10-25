import { PageHeader, Pagination, SectionHeader } from '@umc-product/react';
import { useState } from 'react';

import { useCanEditApplicantStatus, useSessionStore } from '@/entities/session';
import {
  type ApplicantStatus,
  APPLICATION_FILTERS,
  ApplicationTable,
  INITIAL_APPLICATION_FILTERS,
  MOCK_MY_PROJECT_APPLICATION_GROUP,
} from '@/features/application-list';
import {
  MOCK_MY_PROJECT,
  MOCK_MY_PROJECT_ROUND_PROGRESS,
  MOCK_MY_PROJECT_TOTAL_APPLICANTS,
  MyProjectTab,
  RoundApplicationRateCard,
  TotalApplicantsCard,
} from '@/features/application-stats';
import { useVisibleChapters } from '@/features/chapter-select';
import { FilterDropdownGroup } from '@/widgets/filterDropdownGroup';
import { SearchBar } from '@/widgets/searchBar';

import { getBreadcrumbs } from '../-shared/constants';
import UpdatedAtCaption from '../-shared/UpdatedAtCaption';
import ApplicantApplicationModal from './ApplicantApplicationModal';

// 피그마: 지원자 10명씩 페이지 구분
const APPLICANTS_PER_PAGE = 10;

// PM 챌린저 뷰: 내 프로젝트의 지원 현황만
const PmApplications = () => {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(INITIAL_APPLICATION_FILTERS);
  const [page, setPage] = useState(1);
  // TODO: 내 프로젝트 지원 목록 API 연동 후 서버 데이터로 교체
  const [group, setGroup] = useState(MOCK_MY_PROJECT_APPLICATION_GROUP);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const ownChapterId = useSessionStore((state) => state.session.chapterId);
  const chapterName = useVisibleChapters().find(({ id }) => id === ownChapterId)?.name ?? '';
  // PM은 본인 프로젝트 지원자의 배정 상태를 바꿀 수 있음 (매칭이 끝난 차수 제외)
  const canEditStatus = useCanEditApplicantStatus(ownChapterId);

  // 배정 상태를 바꾸면 group이 새로 만들어지므로 id로 다시 찾음
  const selectedApplicant =
    group.applicants.find(({ applicantId }) => applicantId === selectedApplicantId) ?? null;

  // TODO: 배정 상태 변경 API 연동. 지금은 화면에서만 바꾸고 처리 시각을 현재로 갱신
  const handleStatusChange = (applicantId: string, status: ApplicantStatus) => {
    const processedAt = new Date().toISOString();
    setGroup((prev) => ({
      ...prev,
      applicants: prev.applicants.map((applicant) =>
        applicant.applicantId === applicantId ? { ...applicant, status, processedAt } : applicant,
      ),
    }));
  };

  // TODO: API 연동 시 서버 페이지네이션으로 교체
  const { applicants } = group;
  const totalPages = Math.max(1, Math.ceil(applicants.length / APPLICANTS_PER_PAGE));
  const pageGroup = {
    ...group,
    applicants: applicants.slice((page - 1) * APPLICANTS_PER_PAGE, page * APPLICANTS_PER_PAGE),
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1152px]"
        breadcrumbs={getBreadcrumbs('지원 현황')}
        title="지원 현황"
        description="프로젝트별 지원 내역과 지원 현황을 확인하고 관리할 수 있어요."
      />
      <div className="flex w-full max-w-[1084px] flex-col">
        <MyProjectTab {...MOCK_MY_PROJECT} />

        <div className="flex w-full max-w-[1076px] flex-col gap-16 rounded-xl px-6 pt-7 pb-8">
          <section className="flex w-full flex-col gap-4">
            <SectionHeader number="01" title="내 프로젝트 지원 통계" slot={<UpdatedAtCaption />} />
            <div className="flex w-full items-stretch gap-4">
              <div className="w-[581px] shrink-0">
                <RoundApplicationRateCard {...MOCK_MY_PROJECT_ROUND_PROGRESS} />
              </div>
              <div className="w-[348px] shrink-0">
                <TotalApplicantsCard {...MOCK_MY_PROJECT_TOTAL_APPLICANTS} />
              </div>
            </div>
          </section>

          <div className="flex w-full flex-col items-center gap-10">
            <section className="flex w-full flex-col gap-4">
              <SectionHeader number="02" title="지원자 목록" slot={<UpdatedAtCaption />} />
              <div className="flex w-full flex-col gap-5">
                <div className="flex w-full items-start justify-between gap-4">
                  <SearchBar
                    value={keyword}
                    onValueChange={setKeyword}
                    placeholder="닉네임/이름으로 검색하세요."
                    className="w-[456px]"
                  />
                  <FilterDropdownGroup
                    filters={APPLICATION_FILTERS}
                    keys={['school', 'part', 'round']}
                    values={filters}
                    onValueChange={(key, value) =>
                      setFilters((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                </div>
                {/* TODO: 검색어 · 필터 API 연동 */}
                <ApplicationTable
                  view="PM_CHALLENGER"
                  groups={[pageGroup]}
                  onApplicantClick={(_, { applicantId }) => setSelectedApplicantId(applicantId)}
                />
              </div>
            </section>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
      {/* PM은 프로젝트 상세 없이 지원서만 바로 띄움 */}
      <ApplicantApplicationModal
        project={group.project}
        applicant={selectedApplicant}
        chapterName={chapterName}
        onClose={() => setSelectedApplicantId(null)}
        onStatusChange={canEditStatus ? handleStatusChange : undefined}
      />
    </main>
  );
};

export default PmApplications;
