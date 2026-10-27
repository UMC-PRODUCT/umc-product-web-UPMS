import { useQuery } from '@tanstack/react-query';

import { getMatchingRounds } from '../api/getMatchingRounds';

export const useMatchingRounds = (chapterId: number | undefined) =>
  useQuery({
    queryKey: ['matching-rounds', chapterId],
    queryFn: () => getMatchingRounds({ chapterId }),
    enabled: chapterId !== undefined,
  });
