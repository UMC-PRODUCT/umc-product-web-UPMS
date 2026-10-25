import { createFileRoute } from '@tanstack/react-router';

import { NoticeLayout } from '../../-notice';

export const Route = createFileRoute('/demo-day/team-matching/notice')({
  component: NoticeLayout,
});
