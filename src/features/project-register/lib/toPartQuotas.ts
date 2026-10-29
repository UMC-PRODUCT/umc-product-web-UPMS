import type { QuotaCellChange } from '../api/partQuotaManagement';
import type { PePlatform, RecruitInfo } from '../model/types';

type Entry = QuotaCellChange;

const PE_PART: Record<PePlatform, Entry['part']> = {
  WEB: 'WEB_PRODUCT_ENGINEER',
  MOBILE: 'MOBILE_PRODUCT_ENGINEER',
};

// 모집 정보 → 파트별 정원 셀. 쓰지 않는 파트는 0으로 보내 이전에 저장한 정원을 지움 (quota 0은 해당 파트 TO 제거)
export const toPartQuotaEntries = ({ designCount, peCount, pePlatform }: RecruitInfo): Entry[] => [
  { part: 'DESIGN', quota: designCount },
  { part: PE_PART.WEB, quota: pePlatform === 'WEB' ? peCount : 0 },
  { part: PE_PART.MOBILE, quota: pePlatform === 'MOBILE' ? peCount : 0 },
];

// 프로젝트 상세의 파트별 정원 → 모집 정보 (PM이 운영진이 정해 둔 모집 정보를 볼 때도 씀)
export const fromPartQuotas = (
  partQuotas: { part?: string; quota?: number }[] | undefined,
): RecruitInfo | null => {
  if (!partQuotas || partQuotas.length === 0) return null;

  const find = (part: string) => partQuotas.find((item) => item.part === part)?.quota ?? 0;
  const webCount = find(PE_PART.WEB);
  const mobileCount = find(PE_PART.MOBILE);

  return {
    designCount: find('DESIGN'),
    peCount: Math.max(webCount, mobileCount),
    pePlatform: webCount > 0 ? 'WEB' : mobileCount > 0 ? 'MOBILE' : null,
  };
};
