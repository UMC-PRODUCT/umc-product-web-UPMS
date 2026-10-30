import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';

import { getApplicationForm } from '../api/applicationForm';
import { getMyDraftProject } from '../api/getMyDraftProject';
import { getProjectDetail } from '../api/getProjectDetail';
import { fromServerDraft } from '../lib/toDraft';
import type { ProjectDraft } from '../model/types';

// 지원 폼을 볼 권한이 없으면(AUTHORIZATION-xxxx) 폼 없음으로 취급해, 폼 때문에 초안 이어 쓰기가 막히지 않게 함
const getApplicationFormOrNull = (projectId: number) =>
  getApplicationForm(projectId).catch((error: unknown) => {
    if (error instanceof ApiError && error.code.startsWith('AUTHORIZATION')) return null;
    throw error;
  });

// 서버에 임시 저장된 내 초안. 없거나(null) 조회할 수 없으면(권한 등) 이어 쓸 초안 없음으로 취급
export const useMyDraftProject = (gisuId: number | null) => {
  const queryClient = useQueryClient();

  const { data: draft = null, isPending } = useQuery({
    queryKey: ['project-draft', gisuId],
    queryFn: () => getMyDraftProject(gisuId as number),
    enabled: gisuId !== null,
    retry: false,
  });

  // 이어 쓰기를 고르면 그때서야 초안의 정원 · 지원 폼을 받아 화면 초안으로 만듦
  const loadDraft = async (): Promise<{ draft: ProjectDraft; projectId: number } | null> => {
    const projectId = toId(draft?.id);
    if (!draft || projectId === null) return null;

    const [detail, form] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProjectDetail(projectId),
      }),
      queryClient.fetchQuery({
        queryKey: ['application-form', projectId],
        queryFn: () => getApplicationFormOrNull(projectId),
      }),
    ]);

    return { draft: fromServerDraft(draft, detail.partQuotas, form), projectId };
  };

  return { hasDraft: draft !== null, isPending: gisuId !== null && isPending, loadDraft };
};
