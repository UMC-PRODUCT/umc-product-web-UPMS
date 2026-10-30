import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-MATCHING-104'];

export type SaveMatchingRoundsBody = Operation['requestBody']['content']['application/json'];

/**
 * 지부 · 매칭 유형별 차수 4개(1 · 2 · 3차 · 랜덤) 일괄 저장 (PROJECT-MATCHING-104)
 * 차수가 없으면 생성, 모두 있으면 ID를 유지한 채 수정. 하나라도 실패하면 전부 저장되지 않음
 */
export const saveMatchingRounds = (chapterId: number, body: SaveMatchingRoundsBody) =>
  api.put<unknown>(`/api/v1/project/matching-rounds/chapters/${chapterId}`, body);
