import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';

import { getApplicationForm } from '../api/applicationForm';
import type { DraftProjectResponse } from '../api/getMyDraftProject';
import { getProjectDetail } from '../api/getProjectDetail';
import { fromServerDraft } from '../lib/toDraft';
import type { ProjectDraft } from '../model/types';

const getApplicationFormOrNull = (projectId: number) =>
  getApplicationForm(projectId).catch((error: unknown) => {
    if (error instanceof ApiError && error.code.startsWith('AUTHORIZATION')) return null;
    throw error;
  });

export type EditProjectData = {
  draft: ProjectDraft;
  projectId: number;
  mainPmId: number | null;
  coPmId: number | null;
};

export const useEditProject = (projectId: number | null) => {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['project-edit', projectId],
    queryFn: async () => {
      const [detail, form] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: ['project', projectId],
          queryFn: () => getProjectDetail(projectId!),
        }),
        queryClient.fetchQuery({
          queryKey: ['application-form', projectId],
          queryFn: () => getApplicationFormOrNull(projectId!),
        }),
      ]);
      return { detail, form };
    },
    enabled: projectId !== null,
    staleTime: Infinity,
  });

  const editData: EditProjectData | null =
    data && projectId !== null
      ? {
          draft: fromServerDraft(
            data.detail as DraftProjectResponse,
            data.detail.partQuotas ?? [],
            data.form,
          ),
          projectId,
          mainPmId: toId(data.detail.productOwner?.memberId) ?? null,
          coPmId: toId(data.detail.coProductOwners?.[0]?.memberId) ?? null,
        }
      : null;

  return {
    editData,
    isPending: projectId !== null && isPending,
  };
};
