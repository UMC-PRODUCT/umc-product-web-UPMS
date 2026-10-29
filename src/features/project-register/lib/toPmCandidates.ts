import { toId } from '@/shared/api/toId';
import { formatSchoolName } from '@/shared/lib/formatSchoolName';

import type { ChallengerSearchResponse } from '../api/searchPmCandidates';
import type { PmCandidate } from '../model/types';

// 챌린저 검색 결과 → PM 후보. 활동 중인 챌린저만, ID는 회원(memberId)
export const toPmCandidates = (response: ChallengerSearchResponse): PmCandidate[] =>
  (response.page?.content ?? []).flatMap(
    ({ memberId, nickname, name, schoolName, challengerStatus }) => {
      const id = toId(memberId);
      if (id === null || (challengerStatus && challengerStatus !== 'ACTIVE')) return [];
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
