import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useChapters } from '@/entities/chapter';

import { getGisuSchools } from '../api/getGisuSchools';
import { toSchoolOptions } from '../lib/toSchoolOptions';
import { getProjectFilters } from '../model/projectFilters';

// 필터 드롭다운 목록. 지부 · 학교 목록은 기수 조직 정보에서 가져옴
export const useProjectFilters = (gisuId: number | null) => {
  const { data: chapters = [] } = useChapters(gisuId);
  const { data: schools = [] } = useQuery({
    queryKey: ['schools', gisuId],
    queryFn: () => getGisuSchools(gisuId as number),
    enabled: gisuId !== null,
    select: toSchoolOptions,
  });

  return useMemo(() => getProjectFilters(chapters, schools), [chapters, schools]);
};
