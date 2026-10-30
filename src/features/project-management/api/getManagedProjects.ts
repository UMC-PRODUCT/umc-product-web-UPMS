import type { ManagedProject, PartRecruitment, RecruitPart } from '@/features/project-management';
import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

type ApiProject = components['schemas']['ManagedProjectSummaryResponse'];
type ApiPartQuota = components['schemas']['PartQuotaInfo'];

export type GetManagedProjectsParams = {
  gisuId: number;
  chapterId?: number;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string[];
};

type PageResponse = components['schemas']['PageResponseManagedProjectSummaryResponse'];

const RECRUIT_PART_MAP: Partial<Record<NonNullable<ApiPartQuota['part']>, RecruitPart>> = {
  DESIGN: 'DESIGN',
  WEB_PRODUCT_ENGINEER: 'WEB_PE',
  MOBILE_PRODUCT_ENGINEER: 'MOBILE_PE',
};

const STATUS_MAP: Partial<Record<string, ManagedProject['status']>> = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING',
  IN_PROGRESS: 'APPROVED',
  COMPLETED: 'APPROVED',
  ABORTED: 'DRAFT',
};

const toManagedProject = (p: ApiProject): ManagedProject => {
  const partQuotas = p.partQuotas ?? [];

  const platform: 'WEB' | 'MOBILE' = partQuotas.some((q) => q.part === 'MOBILE_PRODUCT_ENGINEER')
    ? 'MOBILE'
    : 'WEB';

  const recruitments: PartRecruitment[] = partQuotas
    .filter(
      (q): q is ApiPartQuota & { part: keyof typeof RECRUIT_PART_MAP } =>
        !!q.part && q.part in RECRUIT_PART_MAP,
    )
    .map((q) => ({
      part: RECRUIT_PART_MAP[q.part]!,
      applied: Number(q.currentCount ?? 0),
      capacity: Number(q.quota ?? 0),
      status: q.status === 'COMPLETED' ? 'CLOSED' : 'RECRUITING',
    }));

  return {
    projectId: String(p.id!),
    chapterId: '',
    projectName: p.name ?? '',
    logoUrl: null,
    thumbnailUrl: p.thumbnailImageUrl ?? null,
    pmName: p.productOwner?.name ?? '',
    schoolName: p.productOwner?.schoolName ?? '',
    description: p.description ?? '',
    status: STATUS_MAP[p.status ?? ''] ?? 'DRAFT',
    platform,
    recruitments,
  };
};

export type ManagedProjectsPage = {
  projects: ManagedProject[];
  nextPage: number | null;
};

export const getManagedProjects = async (
  params: GetManagedProjectsParams,
): Promise<ManagedProjectsPage> => {
  const data = await api.get<PageResponse>('/api/v1/projects/me/managed', params);
  return {
    projects: (data.content ?? []).map(toManagedProject),
    nextPage: data.hasNext ? (params.page ?? 0) + 1 : null,
  };
};
