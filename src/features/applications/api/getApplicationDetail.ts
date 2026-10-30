import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-102'];

export type ApplicationDetailPath = Operation['parameters']['path'];
export type ApplicationDetailResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 지원서 단건 상세 조회 (챌린저 본인 지원서, PM · 운영진의 지원자 지원서) */
export const getApplicationDetail = ({ projectId, applicationId }: ApplicationDetailPath) =>
  api.get<ApplicationDetailResponse>(`/api/v1/projects/${projectId}/applications/${applicationId}`);
