import ProjectRoundChart from '@/shared/ui/ProjectRoundChart';

import type { ProjectMatchings } from '../../model/types';

const PART_TOOLTIP = {
  DESIGN: { label: 'Design', color: 'design' },
  WEB_PE: { label: 'Web', color: 'web-pe' },
  MOBILE_PE: { label: 'Mobile', color: 'mobile-pe' },
} as const;

type ProjectMatchingChartProps = {
  projects: ProjectMatchings[];
};

// 프로젝트별 매칭 현황 카드
// 툴팁(피그마): 현재까지 매칭된 인원 / 전체 모집 인원(TO) + 파트별 매칭 인원 / 파트별 모집 인원
const ProjectMatchingChart = ({ projects }: ProjectMatchingChartProps) => (
  <ProjectRoundChart
    title="프로젝트별 매칭 현황"
    seriesLabel="매칭"
    emptyMessage="아직 매칭된 프로젝트가 없어요."
    projects={projects.map(({ projectName, counts, parts }) => ({
      projectName,
      counts,
      tooltip: {
        summary: `매칭완료: ${parts.reduce((sum, { matched }) => sum + matched, 0)}명`,
        referenceSummary: `${parts.reduce((sum, { capacity }) => sum + capacity, 0)}명`,
        items: parts.map(({ part, matched, capacity }) => ({
          key: part,
          ...PART_TOOLTIP[part],
          value: `${matched}명`,
          reference: `${capacity}명`,
        })),
      },
    }))}
  />
);

export default ProjectMatchingChart;
