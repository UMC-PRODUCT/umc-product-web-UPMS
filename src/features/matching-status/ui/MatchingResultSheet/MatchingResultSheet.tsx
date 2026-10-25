import type {
  MatchedMember,
  PartMatching,
  PlatformMatchingResults,
  ProjectMatchingResult,
  RoundMatchingKey,
} from '../../model/types';
import MatchingRoundTag from './MatchingRoundTag';
import ProjectMatchingRow from './ProjectMatchingRow';

const PLATFORM_LABEL: Record<PlatformMatchingResults['platform'], string> = {
  WEB: 'Web',
  MOBILE: 'Mobile',
};

const LEGEND: { round: RoundMatchingKey; label: string }[] = [
  { round: 1, label: '차 매칭' },
  { round: 2, label: '차 매칭' },
  { round: 3, label: '차 매칭' },
  { round: 'RANDOM', label: '랜덤 매칭' },
];

type MatchingResultSheetProps = PlatformMatchingResults & {
  // 마스터 · 지부장만 (그 외 뷰, 최종 결과 발표 뒤에는 넘기지 않아 조회만)
  // 지원서 열기 → 매칭 해제
  onMemberClick?: (
    project: ProjectMatchingResult,
    part: PartMatching,
    member: MatchedMember,
  ) => void;
  onEmptySlotClick?: (project: ProjectMatchingResult, part: PartMatching) => void; // 수동 배정
};

// 피그마 매칭 결과 시트: 플랫폼 제목 + 표 머리(차수 범례) + 프로젝트별 매칭 결과
const MatchingResultSheet = ({
  platform,
  projects,
  onMemberClick,
  onEmptySlotClick,
}: MatchingResultSheetProps) => (
  <section className="flex w-full flex-col">
    <h3 className="rounded-t-xl border border-b-0 border-teal-300 bg-teal-100 py-2 pr-5 pl-[30px] text-heading-4-semibold text-teal-600">
      {PLATFORM_LABEL[platform]}
    </h3>
    <div className="flex h-[38px] items-center gap-3.5 border-x border-teal-300 bg-teal-50 px-[30px] text-body-3-medium text-teal-900">
      <p className="w-[154px] shrink-0">프로젝트 명</p>
      <p className="w-[130px] shrink-0">Plan</p>
      <div className="flex flex-1 items-center justify-between">
        <p>매칭 결과표</p>
        <ul className="flex items-center gap-3">
          {LEGEND.map(({ round, label }) => (
            <li
              key={round}
              className="flex items-center gap-0.5 text-caption-2-medium text-teal-grey-700"
            >
              <MatchingRoundTag round={round} />
              {round !== 'RANDOM' && <span className="sr-only">{round}</span>}
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
    {projects.length === 0 ? (
      <p className="flex min-h-[128px] items-center justify-center rounded-b-xl border border-teal-200 text-body-3-medium text-teal-grey-500">
        현재 매칭된 프로젝트가 없어요.
      </p>
    ) : (
      // 줄 사이 1px 회색 구분선은 배경 + 간격으로 표현
      <ul className="flex flex-col gap-px overflow-clip rounded-b-xl border border-teal-200 bg-teal-grey-200">
        {projects.map((project) => (
          <ProjectMatchingRow
            key={project.projectId}
            project={project}
            onMemberClick={onMemberClick}
            onEmptySlotClick={onEmptySlotClick}
          />
        ))}
      </ul>
    )}
  </section>
);

export default MatchingResultSheet;
