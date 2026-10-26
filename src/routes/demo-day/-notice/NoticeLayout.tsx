import { Outlet } from '@tanstack/react-router';

import { TopToastProvider } from '@/widgets/toast';

// 피그마: 공지 화면의 토스트는 브라우저 상단에서 112px 아래에 뜬다.
// 작성 → 목록으로 이동해도 토스트가 사라지지 않게 두 화면을 함께 감싼다.
const NoticeLayout = () => (
  <TopToastProvider>
    <Outlet />
  </TopToastProvider>
);

export default NoticeLayout;
