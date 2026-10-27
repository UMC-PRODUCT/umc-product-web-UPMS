import { toId } from '@/shared/api/toId';

import type { MyInfoResponse } from '../api/getMyInfo';
import type { ChallengerType, Role, Session } from '../model/types';

type RoleType = NonNullable<
  NonNullable<MyInfoResponse['currentGisuMemberInfo']>['roleTypes']
>[number];

// 서버 운영진 역할 → 화면 역할. 역할이 여러 개면 위에 있는 역할을 씀
const ROLE_PRIORITY: [RoleType[], Role][] = [
  [['CENTRAL_PRESIDENT', 'CENTRAL_VICE_PRESIDENT'], 'HQ_LEAD'],
  [['CENTRAL_OPERATING_TEAM_MEMBER', 'CENTRAL_EDUCATION_TEAM_MEMBER'], 'HQ_ADMIN'],
  [['CHAPTER_PRESIDENT'], 'CHAPTER_ADMIN'],
  [['SCHOOL_PRESIDENT', 'SCHOOL_VICE_PRESIDENT'], 'SCHOOL_ADMIN'],
  [['SCHOOL_PART_LEADER', 'SCHOOL_ETC_ADMIN'], 'SCHOOL_STAFF'],
];

// 챌린저로도 활동하는 운영진 역할 (이 역할일 때만 챌린저 유형을 둠)
const STAFF_ROLES: Role[] = [
  'HQ_LEAD',
  'HQ_ADMIN',
  'CHAPTER_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_STAFF',
];

// chapterId는 mock 지부 ID라 서버 응답만으로는 알 수 없어서, 대신 지부 이름을 같이 돌려줌
export type ServerSession = Omit<Session, 'chapterId'> & { chapterName: string | null };

// /api/v2/member/me 응답을 화면에서 쓰는 세션으로 바꿈
// - 소속 지부: challengerHistory 중 현재 기수(currentGisuMemberInfo.gisuId) 기록의 지부
// - PM: 파트가 PLAN인 챌린저
export const toSession = ({
  isSuperAdmin,
  currentGisuMemberInfo,
  challengerHistory,
}: MyInfoResponse): ServerSession => {
  const roleTypes = currentGisuMemberInfo?.roleTypes ?? [];
  const part = currentGisuMemberInfo?.challenger?.part;
  const staffRole = ROLE_PRIORITY.find(([types]) =>
    types.some((type) => roleTypes.includes(type)),
  )?.[1];

  const role: Role = isSuperAdmin
    ? 'SUPER_ADMIN'
    : (staffRole ?? (part === 'PLAN' ? 'CHALLENGER_PM' : 'CHALLENGER'));

  // 운영진 파트(ADMIN)로만 등록된 경우는 챌린저 활동이 없음
  const challengerType: ChallengerType | null =
    STAFF_ROLES.includes(role) && part !== undefined && part !== 'ADMIN'
      ? part === 'PLAN'
        ? 'PM'
        : 'GENERAL'
      : null;

  // ID가 문자열로 와서 숫자로 맞춰 비교
  const gisuId = toId(currentGisuMemberInfo?.gisuId);
  const currentRecord = challengerHistory?.find(
    (record) => gisuId !== null && toId(record.gisuId) === gisuId,
  );

  return {
    role,
    challengerType,
    serverChapterId: toId(currentRecord?.chapterId),
    gisuId,
    chapterName: currentRecord?.chapterName ?? null,
  };
};
