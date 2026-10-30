import { toId } from '@/shared/api/toId';
import { formatSchoolName } from '@/shared/lib/formatSchoolName';

import type { ProjectDetailResponse } from '../api/getProjectDetail';
import type { ProjectMembersResponse } from '../api/getProjectMembers';
import type { ProjectsResponse } from '../api/getProjects';
import type {
  PartRecruitment,
  Project,
  RecruitPart,
  RecruitStatus,
  TeamMember,
  TeamMemberRound,
} from '../model/types';

type ProjectSummary = NonNullable<ProjectsResponse['content']>[number];
type ServerPart = NonNullable<NonNullable<ProjectSummary['partQuotas']>[number]['part']>;
type ServerRound = NonNullable<
  NonNullable<NonNullable<ProjectMembersResponse['productOwner']>['matchedRoundInfo']>['phase']
>;

// 목록에는 Design + 서비스 플랫폼의 PE만 보임. 이 순서대로 표시
const RECRUIT_PARTS: [ServerPart, RecruitPart][] = [
  ['DESIGN', 'DESIGN'],
  ['WEB_PRODUCT_ENGINEER', 'WEB_PE'],
  ['MOBILE_PRODUCT_ENGINEER', 'MOBILE_PE'],
];

const ROUND: Record<ServerRound, TeamMemberRound> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  RANDOM_MATCHING: 'RANDOM',
};

const toRecruitStatus = (status: string | undefined): RecruitStatus =>
  status === 'RECRUITING' ? 'RECRUITING' : 'CLOSED';

// 닉네임/이름 표기. 둘 중 하나만 있으면 있는 것만
export const toPersonLabel = (person: { nickname?: string; name?: string } | undefined) =>
  [person?.nickname, person?.name].filter(Boolean).join('/');

// 목록 응답 → 화면 프로젝트. 로고 · 기획 링크 · 팀원은 목록에 없어서 상세 모달에서 채움
// 프로젝트 지부는 서버 응답에 없어서, 지부로 거른 조회일 때만 그 지부를 넣음
export const toProject = (
  { id, name, description, thumbnailImageUrl, productOwner, partQuotas }: ProjectSummary,
  chapterId: string | null,
): Project => {
  const recruitments: PartRecruitment[] = RECRUIT_PARTS.flatMap(([serverPart, part]) => {
    const quota = partQuotas?.find((item) => item.part === serverPart);
    return quota
      ? [
          {
            part,
            applied: quota.currentCount ?? 0,
            capacity: quota.quota ?? 0,
            status: toRecruitStatus(quota.status),
            members: [],
          },
        ]
      : [];
  });

  return {
    projectId: String(id),
    projectName: name ?? '',
    logoUrl: null,
    thumbnailUrl: thumbnailImageUrl || null,
    pmName: toPersonLabel(productOwner),
    schoolName: formatSchoolName(productOwner?.schoolName),
    chapterId,
    description: description ?? '',
    platform: recruitments.some(({ part }) => part === 'MOBILE_PE') ? 'MOBILE' : 'WEB',
    planUrl: null,
    recruitments,
  };
};

const toTeamMembers = (
  members: NonNullable<ProjectMembersResponse['partGroups']>[number]['members'],
): TeamMember[] =>
  (members ?? []).flatMap((member) => {
    const phase = member.matchedRoundInfo?.phase;
    const memberId = toId(member.memberId);
    if (!phase || memberId === null) return [];
    return [
      {
        memberId: String(memberId),
        challengerName: toPersonLabel(member),
        schoolName: formatSchoolName(member.schoolName),
        round: ROUND[phase],
      },
    ];
  });

// 파트별 모집 현황에 팀원 구성을 합침. 목록 응답에는 팀원이 없어서 별도 조회 후 사용
export const toTeamRecruitments = (
  recruitments: Omit<PartRecruitment, 'members'>[],
  membersResponse: ProjectMembersResponse | undefined,
): PartRecruitment[] => {
  const membersByPart = new Map(
    (membersResponse?.partGroups ?? []).map(({ part, members }) => [part, toTeamMembers(members)]),
  );
  return recruitments.map((r) => {
    const serverPart = RECRUIT_PARTS.find(([, part]) => part === r.part)?.[0];
    return { ...r, members: membersByPart.get(serverPart) ?? [] };
  });
};

// 목록 프로젝트에 상세(로고 · 기획 링크)와 팀원 구성을 덧붙임. 아직 못 받은 값은 그대로 둠
export const applyProjectDetail = (
  project: Project,
  detail: ProjectDetailResponse | undefined,
  teamMembers: ProjectMembersResponse | undefined,
): Project => {
  const membersByPart = new Map(
    (teamMembers?.partGroups ?? []).map(({ part, members }) => [part, toTeamMembers(members)]),
  );

  return {
    ...project,
    logoUrl: detail?.logoImageUrl || project.logoUrl,
    planUrl: detail?.externalLink || project.planUrl,
    recruitments: project.recruitments.map((recruitment) => {
      const serverPart = RECRUIT_PARTS.find(([, part]) => part === recruitment.part)?.[0];
      return { ...recruitment, members: membersByPart.get(serverPart) ?? recruitment.members };
    }),
  };
};
