import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

export type AddProjectMemberRequest = components['schemas']['AddProjectMemberRequest'];
export type TransferProjectOwnershipRequest =
  components['schemas']['TransferProjectOwnershipRequest'];

/** 프로젝트 팀원 추가 (보조 PM은 PLAN 파트로 추가) */
export const addProjectMember = (projectId: number, body: AddProjectMemberRequest) =>
  api.post<unknown>(`/api/v1/projects/${projectId}/members`, body);

/** 프로젝트 팀원 제거 */
export const removeProjectMember = (projectId: number, memberId: number) =>
  api.delete<unknown>(`/api/v1/projects/${projectId}/members/${memberId}`);

/** 메인 PM 양도 */
export const transferProjectOwnership = (
  projectId: number,
  body: TransferProjectOwnershipRequest,
) => api.post<unknown>(`/api/v1/projects/${projectId}/transfer-ownership`, body);
