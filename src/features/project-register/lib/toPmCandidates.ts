import { toId } from '@/shared/api/toId';
import { formatSchoolName } from '@/shared/lib/formatSchoolName';

import type { MemberSearchResponse } from '../api/searchPmCandidates';
import type { PmCandidate } from '../model/types';

// 회원 검색 결과 → PM 후보. 활동 중인 챌린저만, ID는 회원(memberId)
export const toPmCandidates = (response: MemberSearchResponse): PmCandidate[] =>
  (response.page?.content ?? []).flatMap(
    ({ memberId, nickname, name, schoolName, currentChallenger }) => {
      const id = toId(memberId);
      const status = currentChallenger?.challengerStatus;
      if (id === null || (status && status !== 'ACTIVE')) return [];
      return [
        {
          id: String(id),
          nickname: nickname ?? '',
          name: name ?? '',
          schoolName: formatSchoolName(schoolName),
        },
      ];
    },
  );
