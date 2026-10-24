import type { ProjectApplications } from '../../model/types';
import { ROUND_BG_CLASS, ROUNDS } from './roundColors';

// 막대 영역 높이 (피그마 기준)
export const BAR_AREA_HEIGHT = 100;
const MIN_BAR_HEIGHT = 2;

// 지원자가 없는 차수는 피그마의 빈 막대 모양
const EMPTY_BAR_CLASS =
  'bg-linear-to-b from-[#c7ebe6] from-[47.596%] via-[rgba(199,235,230,0.8)] via-75% to-[rgba(199,235,230,0.7)]';

type ProjectBarGroupProps = ProjectApplications & {
  maxCount: number; // 모든 프로젝트 중 가장 큰 지원 인원 (막대 높이 기준)
};

// 프로젝트 하나의 차수별 막대 + 프로젝트명
const ProjectBarGroup = ({ projectName, counts, maxCount }: ProjectBarGroupProps) => (
  <li className="flex w-[60px] shrink-0 flex-col items-center gap-[5px]">
    <div className="flex items-end gap-[5px]" style={{ height: BAR_AREA_HEIGHT }}>
      {ROUNDS.map((round) => {
        const count = counts[round];
        const height =
          maxCount === 0
            ? MIN_BAR_HEIGHT
            : Math.max(MIN_BAR_HEIGHT, (count / maxCount) * BAR_AREA_HEIGHT);

        return (
          <span
            key={round}
            aria-label={`${round}차 지원 ${count}명`}
            className={`w-2.5 shrink-0 rounded-t ${count > 0 ? ROUND_BG_CLASS[round] : EMPTY_BAR_CLASS}`}
            style={{ height }}
          />
        );
      })}
    </div>
    <p className="h-[42px] w-full text-center text-body-3-medium break-keep text-teal-grey-900">
      {projectName}
    </p>
  </li>
);

export default ProjectBarGroup;
