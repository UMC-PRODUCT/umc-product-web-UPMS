import { createFileRoute } from '@tanstack/react-router';

import { useApplicationsView } from '@/entities/session';

import AdminApplications from './-applications/AdminApplications';
import ChallengerApplications from './-applications/ChallengerApplications';
import PmApplications from './-applications/PmApplications';

// 지원 현황: 주소는 하나, 권한(뷰)에 따라 화면만 다르게
const ApplicationsPage = () => {
  const view = useApplicationsView();
  if (view === 'ADMIN') return <AdminApplications />;
  if (view === 'PM_CHALLENGER') return <PmApplications />;
  return <ChallengerApplications />;
};

export const Route = createFileRoute('/demo-day/team-matching/applications')({
  component: ApplicationsPage,
});
