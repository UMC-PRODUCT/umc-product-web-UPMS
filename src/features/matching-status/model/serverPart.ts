import type { AssignProjectMemberBody } from '../api/assignProjectMember';
import type { MatchingPart } from './types';

type ServerPart = NonNullable<AssignProjectMemberBody['part']>;

// 모집 파트 → 서버 파트 (수동 배정 · 후보 조회에 보냄)
export const SERVER_PART: Record<MatchingPart, ServerPart> = {
  DESIGN: 'DESIGN',
  WEB_PE: 'WEB_PRODUCT_ENGINEER',
  MOBILE_PE: 'MOBILE_PRODUCT_ENGINEER',
};
