import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toId } from '@/shared/api/toId';

import { createMatchingRound } from '../api/createMatchingRound';
import type { MatchingRoundsResponse } from '../api/getMatchingRounds';
import { updateMatchingRound } from '../api/updateMatchingRound';
import { toMatchingRoundRequests } from '../model/toMatchingRoundRequests';
import type { MatchingScheduleSetting, MatchingTrack } from '../model/types';

type SaveMatchingScheduleVariables = {
  chapterId: number;
  track: MatchingTrack;
  setting: MatchingScheduleSetting;
  existingRounds: MatchingRoundsResponse; // 이 지부의 서버 차수 (있는 차수는 수정, 없는 차수는 생성)
};

// 한 탭(Plan-Design · Plan-PE)의 차수 4개를 서버에 저장
export const useSaveMatchingSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chapterId,
      track,
      setting,
      existingRounds,
    }: SaveMatchingScheduleVariables) => {
      const requests = toMatchingRoundRequests(setting, track);
      const existing = new Map(
        existingRounds
          .filter(({ type }) => type === requests[0]?.type)
          .map((round) => [round.phase, round]),
      );

      // 같은 지부 차수끼리 기간이 겹치면 409라서, 일정을 뒤로 미루면 마지막 차수부터 고침
      const previousStart = existing.get('FIRST')?.startsAt;
      const movesLater =
        previousStart !== undefined &&
        requests.length > 0 &&
        new Date(requests[0].startsAt) > new Date(previousStart);

      // 순서가 중요해서 한 차수씩 차례로 보냄
      for (const request of movesLater ? [...requests].reverse() : requests) {
        // ID가 문자열로 와서 숫자로 맞춤
        const id = toId(existing.get(request.phase)?.id);
        if (id === null) await createMatchingRound({ ...request, chapterId });
        else await updateMatchingRound(id, request);
      }
    },
    // 중간에 실패해도 서버에 반영된 차수가 보이도록 성공 · 실패 모두 다시 불러옴
    onSettled: (_data, _error, { chapterId }) =>
      queryClient.invalidateQueries({ queryKey: ['matching-rounds', chapterId] }),
  });
};
