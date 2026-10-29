import { useLocation, useRouter } from '@tanstack/react-router';
import { PeoplePictogram } from '@umc-product/icons';
import { ContextSwitcher, SideNavigation, type SideNavigationGroup } from '@umc-product/react';

import {
  getViewOptions,
  type ProjectSettingsAccess,
  useApplicationsView,
  useProjectSettingsAccess,
  useSessionStore,
  type View,
} from '@/entities/session';
import { TEAM_MATCHING_MENU } from '@/shared/config/teamMatchingMenu';

// 사이드바가 선택 상태에 따라 아이콘 색을 바꾸도록 currentColor를 넘긴다
const peopleIcon = <PeoplePictogram color="currentColor" />;

const APPLICATIONS_HREF = '/demo-day/team-matching/applications';

// 피그마: 일반 챌린저는 본인 지원만 보므로 '지원 현황' 메뉴를 '내 지원 현황'으로 표시
const getTeamMatchingGroup = (isChallengerView: boolean): SideNavigationGroup => ({
  label: '팀 매칭',
  icon: peopleIcon,
  children: TEAM_MATCHING_MENU.map((item) =>
    isChallengerView && item.href === APPLICATIONS_HREF ? { ...item, label: '내 지원 현황' } : item,
  ),
});

const getProjectSettingsGroup = (access: ProjectSettingsAccess): SideNavigationGroup | null => {
  if (access === 'NONE') return null;

  const basicChildren = [
    { label: '공지', href: '/demo-day/project-settings/notice' },
    { label: '프로젝트 관리', href: '/demo-day/project-settings/projects' },
  ];
  const fullChildren = [
    { label: '매칭 차수 설정', href: '/demo-day/project-settings/rounds' },
    { label: '프로젝트 TO 관리', href: '/demo-day/project-settings/quota' },
  ];

  return {
    label: '프로젝트 설정',
    icon: peopleIcon,
    children: access === 'FULL' ? [...basicChildren, ...fullChildren] : basicChildren,
  };
};

const Sidebar = () => {
  const router = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });
  const session = useSessionStore((state) => state.session);
  const view = useSessionStore((state) => state.view);
  const setView = useSessionStore((state) => state.setView);
  const access = useProjectSettingsAccess();
  const applicationsView = useApplicationsView();

  const viewOptions = getViewOptions(session);
  const projectSettingsGroup = getProjectSettingsGroup(access);
  const teamMatchingGroup = getTeamMatchingGroup(applicationsView === 'CHALLENGER');
  const items = projectSettingsGroup
    ? [projectSettingsGroup, teamMatchingGroup]
    : [teamMatchingGroup];

  const handleViewChange = (nextView: View) => {
    setView(nextView);
    // 바뀐 뷰에서 권한이 없는 페이지에 있으면 라우트 가드가 리다이렉트하도록 다시 검사
    router.invalidate();
  };

  return (
    <SideNavigation
      className="w-(--umc-layout-sidebar-width) shrink-0"
      title="11th Demo day"
      items={items}
      currentPath={pathname}
      slot={
        viewOptions.length > 0 && (
          <ContextSwitcher options={viewOptions} value={view} onValueChange={handleViewChange} />
        )
      }
    />
  );
};

export default Sidebar;
