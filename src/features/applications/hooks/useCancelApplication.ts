import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelApplication } from '../api/cancelApplication';
import { applicationKeys } from '../api/queryKeys';

// 지원 취소 (지원 기간인 차수의 지원서만 가능)
export const useCancelApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelApplication,
    // 취소한 지원서가 목록에서 빠지도록 내 지원 목록 · 지원서를 다시 불러옴
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  });
};
