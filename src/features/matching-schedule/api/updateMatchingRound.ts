import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-MATCHING-102'];

export type UpdateMatchingRoundBody = Operation['requestBody']['content']['application/json'];

/** 매칭 차수 수정 (보내지 않은 필드는 기존 값 유지) */
export const updateMatchingRound = (matchingRoundId: number, body: UpdateMatchingRoundBody) =>
  api.patch<unknown>(`/api/v1/project/matching-rounds/${matchingRoundId}`, body);
