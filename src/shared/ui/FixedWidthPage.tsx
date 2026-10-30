import type { ReactNode } from 'react';

// 반응형 없는 페이지: 화면이 좁아져도 피그마 폭(1440 - 사이드바 216)을 유지하고 넘치는 부분은 자름
// 안쪽에서 100cqw가 화면에 보이는 폭이라, 표는 max-w-[calc(100cqw-여백)]으로 줄여 가로 스크롤
const FixedWidthPage = ({ children }: { children: ReactNode }) => (
  <div className="@container overflow-x-clip">
    <div className="min-w-[calc(1440px-var(--spacing-sidebar))]">{children}</div>
  </div>
);

export default FixedWidthPage;
