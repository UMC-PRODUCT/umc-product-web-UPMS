import { toCount, toId } from '@/shared/api/toId';
import type { MatchingResult } from '@/shared/ui/MatchingResultTag';

import type { MyApplicationsResponse } from '../api/getMyApplications';
import type {
  AppliedProject,
  AppliedRoundGroup,
  PartRecruitment,
  RecruitPart,
  ServicePlatform,
} from './types';

type MyApplication = MyApplicationsResponse[number];
type MatchingRoundBrief = NonNullable<MyApplication['matchingRound']>;
type PartQuota = NonNullable<NonNullable<MyApplication['project']>['partQuotas']>[number];

// 서버 매칭 종류 → 화면 이름 (서버는 PE를 DEVELOPER로 부름)
const TRACK_NAME: Record<NonNullable<MatchingRoundBrief['type']>, string> = {
  PLAN_DESIGN: 'Plan-Design',
  PLAN_DEVELOPER: 'Plan-PE',
};

const PHASE_NAME: Record<NonNullable<MatchingRoundBrief['phase']>, string> = {
  FIRST: '1차 매칭',
  SECOND: '2차 매칭',
  THIRD: '3차 매칭',
  RANDOM_MATCHING: '랜덤 매칭',
};

// 서버 파트 → 모집 파트 (Design과 PE만 모집)
const RECRUIT_PART: Partial<Record<NonNullable<PartQuota['part']>, RecruitPart>> = {
  DESIGN: 'DESIGN',
  WEB_PRODUCT_ENGINEER: 'WEB_PE',
  MOBILE_PRODUCT_ENGINEER: 'MOBILE_PE',
};

// 결과는 발표 뒤에만 합격(APPROVED) · 불합격(REJECTED)으로 옴. 그 전(SUBMITTED)은 표시하지 않음
const RESULT: Partial<Record<NonNullable<MyApplication['status']>, MatchingResult>> = {
  APPROVED: 'PASSED',
  REJECTED: 'FAILED',
};

// 랜덤 매칭 카드는 차수 ID가 null이라 따로 묶음
const RANDOM_ROUND_KEY = 'random';

const toRecruitments = (partQuotas: PartQuota[] = []): PartRecruitment[] =>
  partQuotas.flatMap(({ part, currentCount, quota, status }) => {
    const recruitPart = part && RECRUIT_PART[part];
    if (!recruitPart) return [];
    return [
      {
        part: recruitPart,
        // 인원 · 정원이 문자열로 와서 숫자로 맞춤
        applied: toCount(currentCount),
        capacity: toCount(quota),
        status: status === 'RECRUITING' ? 'RECRUITING' : 'CLOSED',
      },
    ];
  });

// 모집 파트에 모바일 PE가 있으면 모바일 서비스, 아니면 웹 서비스
const toPlatform = (recruitments: PartRecruitment[]): ServicePlatform =>
  recruitments.some(({ part }) => part === 'MOBILE_PE') ? 'MOBILE' : 'WEB';

const toRoundName = ({ type, phase }: MatchingRoundBrief) =>
  [type && TRACK_NAME[type], phase && PHASE_NAME[phase]].filter(Boolean).join(' ');

// 내 지원 목록 → 매칭 차수별 카드 묶음 (서버 정렬: 차수 시작일 순, 랜덤 매칭 카드는 마지막)
// openRoundIds: 지금 지원 기간인 차수. 그 차수 지원서만 취소 · 수정할 수 있음
export const toAppliedRoundGroups = (
  applications: MyApplicationsResponse,
  openRoundIds: ReadonlySet<number>,
): AppliedRoundGroup[] => {
  const groups = new Map<string, AppliedRoundGroup>();

  for (const { applicationId, projectId, project, matchingRound = {}, status } of applications) {
    // 철회한 지원서는 목록에서 뺌 (서버는 임시저장만 빼고 줌)
    if (status === 'CANCELLED' || status === 'DRAFT') continue;
    // ID가 문자열로 와서 숫자로 맞춤
    const id = toId(projectId);
    if (id === null) continue;

    const roundId = toId(matchingRound.id);
    const isRandom = matchingRound.phase === 'RANDOM_MATCHING';
    const key = roundId === null ? RANDOM_ROUND_KEY : String(roundId);
    const recruitments = toRecruitments(project?.partQuotas);
    const owner = project?.productOwner;

    const applied: AppliedProject = {
      applicationId: toId(applicationId),
      projectId: id,
      projectName: project?.name ?? '',
      thumbnailUrl: project?.thumbnailImageUrl || null,
      pmName: [owner?.nickname, owner?.name].filter(Boolean).join('/'),
      schoolName: owner?.schoolName ?? '',
      platform: toPlatform(recruitments),
      recruitments,
      applicationEditable: roundId !== null && openRoundIds.has(roundId),
      result: (status && RESULT[status]) ?? null,
    };

    const group = groups.get(key);
    if (group) group.projects.push(applied);
    else
      groups.set(key, {
        roundId: key,
        roundName: toRoundName(matchingRound),
        matchingType: isRandom ? 'RANDOM' : 'REGULAR',
        projects: [applied],
      });
  }

  return [...groups.values()];
};
