import {
  CategoryGroupChart,
  type CategoryGroupChartSeries,
  ChartLegend,
  type ChartTooltipContent,
} from '@umc-product/react';

export type ProjectRoundCounts = {
  projectName: string;
  counts: Record<1 | 2 | 3, number>; // 차수별 인원
  tooltip?: ChartTooltipContent; // 없으면 디자인 시스템 기본 툴팁 (차수별 인원)
};

type ProjectRoundChartProps = {
  title: string; // 예: 프로젝트별 지원 현황
  seriesLabel: string; // 범례 · 툴팁의 "N차 ___" (예: 지원, 매칭)
  projects: ProjectRoundCounts[];
  emptyMessage?: string; // 프로젝트가 없을 때 (지원 현황: 등록된 / 전체 매칭 현황: 매칭된)
};

const ROUND_COLORS = ['teal-500', 'teal-400', 'teal-300'] as const;

// 피그마 프로젝트별 지원 · 매칭 현황 카드 (디자인 시스템 CategoryGroupChart)
// 한 줄에 프로젝트 14개를 카드 폭에 꽉 채워 배치하고, 15개부터 다음 줄로 넘김
const ProjectRoundChart = ({
  title,
  seriesLabel,
  projects,
  emptyMessage = '아직 등록된 프로젝트가 없어요.',
}: ProjectRoundChartProps) => {
  const series: CategoryGroupChartSeries[] = ROUND_COLORS.map((color, index) => ({
    key: String(index + 1),
    label: `${index + 1}차 ${seriesLabel}`,
    color,
  }));

  return (
    <div className="flex w-full flex-col gap-[46px] rounded-xl border border-teal-grey-100 bg-white px-8 py-7">
      <div className="flex w-full items-center justify-between">
        <p className="text-title-2-semibold whitespace-nowrap text-teal-700">{title}</p>
        <ChartLegend series={series} />
      </div>
      {projects.length === 0 ? (
        // 막대 영역(막대 + 프로젝트명)과 같은 높이
        <p className="flex h-[147px] items-center justify-center text-body-2-medium text-teal-grey-400">
          {emptyMessage}
        </p>
      ) : (
        <CategoryGroupChart
          series={series}
          groups={projects.map(({ projectName, counts, tooltip }) => ({
            key: projectName,
            label: projectName,
            values: { 1: counts[1], 2: counts[2], 3: counts[3] },
            tooltip,
          }))}
          // 디자인 시스템 기본은 6px 간격의 flex 줄바꿈이라, 14칸 그리드로 바꿔 줄마다 같은 위치에 정렬
          // 피그마 호버 영역: 막대 영역(60×100)에 회색 배경
          className="grid grid-cols-[repeat(14,60px)] justify-between [--umc-category-group-chart-row-gap:20px] [&_.umc-category-group-chart\_\_group:focus-visible_.umc-category-group-chart\_\_plot]:bg-teal-grey-100 [&_.umc-category-group-chart\_\_group:hover_.umc-category-group-chart\_\_plot]:bg-teal-grey-100 [&_.umc-category-group-chart\_\_plot]:w-full"
        />
      )}
    </div>
  );
};

export default ProjectRoundChart;
