import { InfoIcon } from '@umc-product/icons';
import { Tooltip } from '@umc-product/react';

// 피그마 Tooltip (지원자 배정): info 아이콘에 호버하면 왼쪽에 안내 문구가 뜸
// 문구가 피그마처럼 두 줄로 떨어지도록 tooltip-nowrap으로 디자인 시스템 최대 너비(240px)를 풂 (app.css)
const AssignmentInfoTooltip = () => (
  <Tooltip
    mode="light"
    side="left"
    title="지원자 배정"
    content={
      <span className="tooltip-nowrap block whitespace-nowrap">
        합격 및 불합격 결과는 각 매칭 차수 종료 시 자동으로 확정돼요.
        <br />
        지원 철회는 해당 차수 마감 전까지만 가능하며, 마감 후에는 변경할 수 없어요.
      </span>
    }
  >
    <button type="button" aria-label="지원자 배정 안내" className="flex text-teal-grey-800">
      <InfoIcon size={24} />
    </button>
  </Tooltip>
);

export default AssignmentInfoTooltip;
