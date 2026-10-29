import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-103'];

export type DraftProjectResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 내 초안 프로젝트 조회 (가장 최근 한 건, 없으면 null) */
export const getMyDraftProject = (gisuId: number) =>
  api.get<DraftProjectResponse | null>('/api/v1/projects/me/draft', { gisuId });
