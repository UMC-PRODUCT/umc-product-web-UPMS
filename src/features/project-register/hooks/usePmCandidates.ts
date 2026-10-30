import { useQuery } from '@tanstack/react-query';

import { searchMembers } from '../api/searchPmCandidates';
import { toPmCandidates } from '../lib/toPmCandidates';

// 후보 목록을 한 번에 받아 입력창에서 거름 (PM 챌린저는 지부당 많아야 수십 명)
const PM_CANDIDATE_SIZE = 200;

type UsePmCandidatesParams = {
  gisuId: number | null;
  chapterId: number | null; // 지부장은 본인 지부 PM만, 그 외 운영진은 null(전체)
  enabled: boolean; // 운영진만 PM을 고름
};

export const usePmCandidates = ({ gisuId, chapterId, enabled }: UsePmCandidatesParams) =>
  useQuery({
    queryKey: ['pm-candidates', gisuId, chapterId],
    queryFn: () =>
      searchMembers({
        gisuId: gisuId as number,
        part: 'PLAN',
        chapterId: chapterId ?? undefined,
        size: PM_CANDIDATE_SIZE,
      }),
    enabled: enabled && gisuId !== null,
    select: toPmCandidates,
  });
