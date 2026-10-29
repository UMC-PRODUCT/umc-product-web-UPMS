import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-103'];

export type ApplicationDecisionPath = Operation['parameters']['path'];
export type ApplicationDecisionBody = Operation['requestBody']['content']['application/json'];
export type ApplicationDecisionResponse = NonNullable<
  Operation['responses'][200]['content']['*/*']
>;

/** 지원서 합격 여부 결정 (배정 상태 변경: 합격 · 불합격 · 대기) */
export const updateApplicationDecision = (
  { projectId, applicationId }: ApplicationDecisionPath,
  body: ApplicationDecisionBody,
) =>
  api.patch<ApplicationDecisionResponse>(
    `/api/v1/projects/${projectId}/applications/${applicationId}/decision`,
    body,
  );
