import { toCount, toId } from '@/shared/api/toId';

import type { MatchingOverviewResponse } from '../api/getMatchingOverview';
import type {
  MatchedMember,
  MatchingPart,
  PartMatching,
  PlatformMatchingResults,
  ProjectMatchingResult,
  RoundMatchingKey,
} from './types';

type OverviewProject = NonNullable<MatchingOverviewResponse['projects']>[number];
type OverviewPart = NonNullable<OverviewProject['parts']>[number];
type OverviewMember = NonNullable<OverviewPart['members']>[number];
type ServerPart = NonNullable<OverviewPart['part']>;
type Phase = NonNullable<NonNullable<OverviewMember['matchedRoundInfo']>['phase']>;

// 모집 파트와 결과 시트 칸 이름 (PE는 서비스 플랫폼 이름)
const MATCHING_PART: Partial<Record<ServerPart, { part: MatchingPart; label: string }>> = {
  DESIGN: { part: 'DESIGN', label: 'Design' },
  WEB_PRODUCT_ENGINEER: { part: 'WEB_PE', label: 'Web' },
  MOBILE_PRODUCT_ENGINEER: { part: 'MOBILE_PE', label: 'Mobile' },
};

const ROUND_KEY: Record<Phase, RoundMatchingKey> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  RANDOM_MATCHING: 'RANDOM',
};

const toName = ({ nickname, name }: { nickname?: string; name?: string } = {}) =>
  [nickname, name].filter(Boolean).join('/');

const toMember = (member: OverviewMember): MatchedMember | null => {
  // ID가 문자열로 와서 숫자로 맞춤
  const memberId = toId(member.memberId);
  if (memberId === null) return null;
  const phase = member.matchedRoundInfo?.phase;
  return {
    memberId,
    challengerName: toName(member),
    schoolName: member.schoolName ?? '',
    // 지원 없이 수동 배정되면 매칭 차수가 없음 → 랜덤 매칭과 같이 R로 표시
    round: phase ? ROUND_KEY[phase] : 'RANDOM',
    matchedAt: null,
    submittedAt: null,
  };
};

const toProjectResult = ({
  projectId,
  projectName,
  productOwner,
  partQuotaStatus,
  parts = [],
}: OverviewProject): ProjectMatchingResult | null => {
  const id = toId(projectId);
  if (id === null) return null;

  return {
    projectId: id,
    projectName: projectName ?? '',
    pmName: toName(productOwner),
    pmSchoolName: productOwner?.schoolName ?? '',
    recruiting: partQuotaStatus === 'RECRUITING',
    parts: parts.flatMap(({ part, quota, members = [] }): PartMatching[] => {
      const matching = part && MATCHING_PART[part];
      if (!matching) return [];
      return [
        {
          part: matching.part,
          partLabel: matching.label,
          capacity: toCount(quota),
          members: members.flatMap((member) => toMember(member) ?? []),
        },
      ];
    }),
  };
};

// 매칭 결과 시트 응답 → 서비스 플랫폼별 결과 시트 (Web · Mobile 순, 응답의 프로젝트 순서)
// 모바일 PE를 모집하면 Mobile, 아니면 Web
export const toMatchingResults = (projects: OverviewProject[]): PlatformMatchingResults[] => {
  const results: Record<PlatformMatchingResults['platform'], ProjectMatchingResult[]> = {
    WEB: [],
    MOBILE: [],
  };
  for (const project of projects) {
    const result = toProjectResult(project);
    if (!result) continue;
    const isMobile = result.parts.some(({ part }) => part === 'MOBILE_PE');
    results[isMobile ? 'MOBILE' : 'WEB'].push(result);
  }
  return [
    { platform: 'WEB', projects: results.WEB },
    { platform: 'MOBILE', projects: results.MOBILE },
  ];
};
