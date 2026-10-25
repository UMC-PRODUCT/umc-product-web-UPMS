import ProjectRoundChart from '@/shared/ui/ProjectRoundChart';

import type { ProjectApplications } from '../../model/types';

type ProjectApplicationsChartProps = {
  projects: ProjectApplications[];
};

// 프로젝트별 지원 현황 카드: 범례 + 프로젝트마다 차수별 지원 막대 그래프
const ProjectApplicationsChart = ({ projects }: ProjectApplicationsChartProps) => (
  <ProjectRoundChart title="프로젝트별 지원 현황" seriesLabel="지원" projects={projects} />
);

export default ProjectApplicationsChart;
