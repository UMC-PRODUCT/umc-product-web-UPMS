import type { ProjectApplications } from '../../model/types';
import chartGrid from './assets/chart-grid.svg';
import ChartLegend from './ChartLegend';
import ProjectBarGroup, { BAR_AREA_HEIGHT } from './ProjectBarGroup';
import { ROUNDS } from './roundColors';

// 피그마: 한 줄에 프로젝트 14개, 15개부터 다음 줄로 넘김
const PROJECTS_PER_ROW = 14;

type ProjectApplicationsChartProps = {
  projects: ProjectApplications[];
};

// 프로젝트별 지원 현황 카드: 범례 + 프로젝트마다 차수별 막대 그래프
const ProjectApplicationsChart = ({ projects }: ProjectApplicationsChartProps) => {
  // 막대 높이는 모든 줄이 같은 기준을 씀
  const maxCount = Math.max(
    0,
    ...projects.flatMap(({ counts }) => ROUNDS.map((round) => counts[round])),
  );
  const rows = Array.from({ length: Math.ceil(projects.length / PROJECTS_PER_ROW) }, (_, index) =>
    projects.slice(index * PROJECTS_PER_ROW, (index + 1) * PROJECTS_PER_ROW),
  );

  return (
    <div className="flex w-full flex-col rounded-xl border border-teal-grey-100 bg-white px-8 py-7">
      <div className="flex w-full flex-col gap-[46px]">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-2-semibold whitespace-nowrap text-teal-700">
            프로젝트별 지원 현황
          </p>
          <ChartLegend />
        </div>

        {rows.length === 0 ? (
          // 막대 영역(막대 + 프로젝트명)과 같은 높이
          <p className="flex h-[147px] items-center justify-center text-body-2-medium text-teal-grey-400">
            아직 등록된 프로젝트가 없어요.
          </p>
        ) : (
          <div className="flex w-full flex-col gap-5">
            {rows.map((row) => (
              <div key={row[0].projectName} className="relative w-full">
                {/* 막대 뒤 가로 눈금선 (줄마다) */}
                <div className="absolute inset-x-0 top-0" style={{ height: BAR_AREA_HEIGHT }}>
                  <div className="absolute inset-[-0.25%_0]">
                    <img src={chartGrid} alt="" className="block size-full max-w-none" />
                  </div>
                </div>
                <ul className="relative flex w-full items-end gap-2.5">
                  {row.map((project) => (
                    <ProjectBarGroup key={project.projectName} {...project} maxCount={maxCount} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApplicationsChart;
