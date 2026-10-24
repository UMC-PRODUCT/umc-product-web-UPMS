import { type LinkProps, useLocation, useNavigate } from '@tanstack/react-router';
import { Tab, TabList, Tabs } from '@umc-product/react';

import { TEAM_MATCHING_MENU } from '@/shared/config/teamMatchingMenu';

// 운영진 뷰 팀 매칭 화면 공통 상단: 제목 + 하위 메뉴 탭
const TeamMatchingHeader = () => {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  // 공지 작성처럼 하위 경로에서도 해당 메뉴 탭이 선택되어 있어야 한다
  const current = TEAM_MATCHING_MENU.find((item) => pathname.startsWith(item.href))?.href;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-heading-2-semibold text-teal-grey-900">팀 매칭</h1>
      <Tabs value={current} onValueChange={(href) => navigate({ to: href as LinkProps['to'] })}>
        <TabList aria-label="팀 매칭 메뉴" className="w-fit">
          {TEAM_MATCHING_MENU.map((item) => (
            <Tab key={item.href} value={item.href}>
              {item.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </div>
  );
};

export default TeamMatchingHeader;
