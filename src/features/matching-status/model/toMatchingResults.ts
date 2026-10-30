import type { ProjectsResponse } from '@/entities/project';
import { toCount, toId } from '@/shared/api/toId';

import type { ProjectMembers } from '../hooks/useProjectsMembers';
import type {
  MatchedMember,
  MatchingPart,
  PartMatching,
  PlatformMatchingResults,
  ProjectMatchingResult,
  RoundMatchingKey,
} from './types';

type ProjectSummary = NonNullable<ProjectsResponse['content']>[number];
type ServerPart = NonNullable<NonNullable<ProjectSummary['partQuotas']>[number]['part']>;
type MemberBrief = NonNullable<ProjectMembers['coProductOwners']>[number];
type Phase = NonNullable<NonNullable<MemberBrief['matchedRoundInfo']>['phase']>;

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

const toMember = (member: MemberBrief): MatchedMember | null => {
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

const toProjectResult = (
  { id, name, productOwner, partQuotas = [], partQuotaStatus }: ProjectSummary,
  membersByProject: ReadonlyMap<number, ProjectMembers>,
): ProjectMatchingResult | null => {
  const projectId = toId(id);
  if (projectId === null) return null;
  const members = membersByProject.get(projectId);

  const parts: PartMatching[] = partQuotas.flatMap(({ part, quota }) => {
    const matching = part && MATCHING_PART[part];
    if (!matching) return [];
    const group = members?.partGroups?.find((partGroup) => partGroup.part === part);
    return [
      {
        part: matching.part,
        partLabel: matching.label,
        capacity: toCount(quota),
        members: (group?.members ?? []).flatMap((member) => toMember(member) ?? []),
      },
    ];
  });

  return {
    projectId,
    projectName: name ?? '',
    pmName: toName(productOwner),
    pmSchoolName: productOwner?.schoolName ?? '',
    recruiting: partQuotaStatus === 'RECRUITING',
    parts,
  };
};

// 지부 프로젝트 + 팀원 구성 → 서비스 플랫폼별 매칭 결과 시트 (Web · Mobile 순, 프로젝트 목록 순서)
// 모바일 PE를 모집하면 Mobile, 아니면 Web. 팀원 구성을 못 불러온 프로젝트는 빈 칸으로 보임
export const toMatchingResults = (
  projects: ProjectSummary[],
  membersByProject: ReadonlyMap<number, ProjectMembers>,
): PlatformMatchingResults[] => {
  const results: Record<PlatformMatchingResults['platform'], ProjectMatchingResult[]> = {
    WEB: [],
    MOBILE: [],
  };
  for (const project of projects) {
    const result = toProjectResult(project, membersByProject);
    if (!result) continue;
    const isMobile = result.parts.some(({ part }) => part === 'MOBILE_PE');
    results[isMobile ? 'MOBILE' : 'WEB'].push(result);
  }
  return [
    { platform: 'WEB', projects: results.WEB },
    { platform: 'MOBILE', projects: results.MOBILE },
  ];
};
