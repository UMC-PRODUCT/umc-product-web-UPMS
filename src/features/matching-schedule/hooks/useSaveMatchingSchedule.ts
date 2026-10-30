import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveMatchingRounds } from '../api/saveMatchingRounds';
import { toMatchingRoundsBody } from '../model/toMatchingRoundRequests';
import type { MatchingScheduleSetting, MatchingTrack } from '../model/types';

type SaveMatchingScheduleVariables = {
  chapterId: number;
  track: MatchingTrack;
  setting: MatchingScheduleSetting;
};

// 한 탭(Plan-Design · Plan-PE)의 차수 4개를 서버에 한 번에 저장
export const useSaveMatchingSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterId, track, setting }: SaveMatchingScheduleVariables) => {
      const body = toMatchingRoundsBody(setting, track);
      // 화면에서 입력값을 먼저 확인해서 보통은 오지 않음
      if (!body) throw new Error('모든 일정을 입력하세요');
      return saveMatchingRounds(chapterId, body);
    },
    onSuccess: (_data, { chapterId }) =>
      queryClient.invalidateQueries({ queryKey: ['matching-rounds', chapterId] }),
  });
};
