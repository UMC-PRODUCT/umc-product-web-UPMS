import type { ProjectsResponse } from '@/entities/project';
import { toCount, toId } from '@/shared/api/toId';

import type { PartRecruitment, PartRecruitments, ProjectApplicationRow } from './types';

type ProjectSummary = NonNullable<ProjectsResponse['content']>[number];
type PartQuota = NonNullable<ProjectSummary['partQuotas']>[number];

// 인원 · 정원이 문자열로 와서 숫자로 맞춤
const toRecruitment = (quota: PartQuota | undefined): PartRecruitment => ({
  applied: toCount(quota?.currentCount),
  capacity: toCount(quota?.quota),
});

// PE는 Web · Mobile 중 모집하는 쪽만. 모바일 PE 정원이 있으면 모바일, 아니면 웹으로 봄
const toRecruitments = (partQuotas: PartQuota[] = []): PartRecruitments => {
  const find = (part: PartQuota['part']) => partQuotas.find((quota) => quota.part === part);
  const design = toRecruitment(find('DESIGN'));
  const mobile = find('MOBILE_PRODUCT_ENGINEER');

  return mobile
    ? { DESIGN: design, WEB_PE: null, MOBILE_PE: toRecruitment(mobile) }
    : { DESIGN: design, WEB_PE: toRecruitment(find('WEB_PRODUCT_ENGINEER')), MOBILE_PE: null };
};

// 프로젝트 목록 한 줄 → 지원자 목록 표의 프로젝트 줄. ID가 없으면 null (표에서 뺌)
export const toProjectApplicationRow = ({
  id,
  name,
  productOwner,
  partQuotas,
  partQuotaStatus,
}: ProjectSummary): ProjectApplicationRow | null => {
  // ID가 문자열로 와서 숫자로 맞춤
  const projectId = toId(id);
  if (projectId === null) return null;

  return {
    projectId,
    projectName: name ?? '',
    part: 'pm',
    challengerName: [productOwner?.nickname, productOwner?.name].filter(Boolean).join('/'),
    schoolName: productOwner?.schoolName ?? '',
    recruitStatus: partQuotaStatus === 'COMPLETED' ? 'CLOSED' : 'RECRUITING',
    recruitments: toRecruitments(partQuotas),
  };
};
