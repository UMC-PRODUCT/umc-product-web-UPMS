import type { AppliedProject, PartRecruitment, RecruitPart, ServicePlatform } from './types';

const PE_PART: Record<ServicePlatform, RecruitPart> = {
  WEB: 'WEB_PE',
  MOBILE: 'MOBILE_PE',
};

// Design + 서비스 플랫폼의 PE만 표시 (Web 서비스면 Web, 모바일 서비스면 Mobile)
export const getVisibleRecruitments = ({
  platform,
  recruitments,
}: Pick<AppliedProject, 'platform' | 'recruitments'>): PartRecruitment[] =>
  recruitments.filter(({ part }) => part === 'DESIGN' || part === PE_PART[platform]);
