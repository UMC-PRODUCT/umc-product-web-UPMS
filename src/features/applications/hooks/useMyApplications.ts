import { skipToken, useQuery } from '@tanstack/react-query';

import { getMyApplications } from '../api/getMyApplications';
import { applicationKeys } from '../api/queryKeys';

// 내 지원 목록 (서버 응답 그대로). 차수별 묶음은 지원 기간 정보와 합쳐야 해서 화면에서 toAppliedRoundGroups로 바꿈
// 기수를 모르면(세션 로딩 전) 부르지 않음
export const useMyApplications = (gisuId: number | null) =>
  useQuery({
    queryKey: applicationKeys.mine(gisuId),
    queryFn: gisuId === null ? skipToken : () => getMyApplications({ gisuId }),
  });
