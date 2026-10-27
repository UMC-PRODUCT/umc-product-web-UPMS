import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-MATCHING-101'];

export type CreateMatchingRoundBody = Operation['requestBody']['content']['application/json'];
export type CreateMatchingRoundResponse = NonNullable<
  Operation['responses'][200]['content']['*/*']
>;

/** 매칭 차수 생성 */
export const createMatchingRound = (body: CreateMatchingRoundBody) =>
  api.post<CreateMatchingRoundResponse>('/api/v1/project/matching-rounds', body);
