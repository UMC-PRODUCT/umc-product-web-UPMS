import { skipToken, useQuery } from '@tanstack/react-query';

import { toId } from '@/shared/api/toId';

import { getMatchingCandidates } from '../api/getMatchingCandidates';
import { SERVER_PART } from '../model/serverPart';
import type { MatchingPart, UnassignedChallenger } from '../model/types';

// 피그마: 검색해야 목록이 보여서 한 번에 넉넉히 받음
const CANDIDATES_SIZE = 50;

type CandidatesTarget = { projectId: number; part: MatchingPart };

// 수동 배정 후보 (빈 칸 파트의 미배정 챌린저, 검색어는 서버에서 거름)
// 모달이 닫혀 있거나 검색어가 없으면 부르지 않음
export const useMatchingCandidates = (target: CandidatesTarget | null, keyword: string) => {
  const trimmed = keyword.trim();

  return useQuery({
    queryKey: ['matching-status', 'candidates', target?.projectId, target?.part, trimmed],
    queryFn:
      target === null || trimmed === ''
        ? skipToken
        : () =>
            getMatchingCandidates(target.projectId, {
              part: SERVER_PART[target.part],
              keyword: trimmed,
              size: CANDIDATES_SIZE,
            }),
    select: ({ content = [] }): UnassignedChallenger[] =>
      content.flatMap(({ memberId, nickname, name, schoolName }) => {
        // ID가 문자열로 와서 숫자로 맞춤
        const id = toId(memberId);
        if (id === null || target === null) return [];
        return [
          {
            memberId: id,
            challengerName: [nickname, name].filter(Boolean).join('/'),
            schoolName: schoolName ?? '',
            part: target.part,
          },
        ];
      }),
  });
};
