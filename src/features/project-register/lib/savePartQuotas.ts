import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';

import {
  getQuotaManagement,
  type QuotaManagementResponse,
  saveQuotaManagement,
} from '../api/partQuotaManagement';
import type { RecruitInfo } from '../model/types';
import { toPartQuotaEntries } from './toPartQuotas';

const hasProject = (info: QuotaManagementResponse, projectId: number) =>
  (info.projects ?? []).some((project) => toId(project.projectId) === projectId);

// 정원은 지부 단위 TO 관리 API로 저장하고, 이 API는 지부 ID가 필요함. 서버가 프로젝트의 지부를 PM의 학교로 정하므로,
// 지부를 모르면 각 지부의 프로젝트 목록에서 이 프로젝트가 있는 지부를 찾음
export const findProjectChapterId = async (gisuId: number, projectId: number) => {
  const first = await getQuotaManagement({ gisuId });
  const firstChapterId = toId(first.chapterId);
  if (firstChapterId !== null && hasProject(first, projectId)) return firstChapterId;

  const chapterIds = (first.chapters ?? []).flatMap(({ chapterId }) => toId(chapterId) ?? []);
  for (const chapterId of chapterIds.filter((id) => id !== firstChapterId)) {
    // 한 지부의 조회가 서버 오류로 실패해도 나머지 지부에서 계속 찾음
    const info = await getQuotaManagement({ gisuId, chapterId }).catch(() => null);
    if (info && hasProject(info, projectId)) return chapterId;
  }

  throw new ApiError(
    0,
    'CHAPTER_NOT_FOUND',
    '프로젝트의 지부를 찾지 못했어요. PM의 학교가 지부에 배정되어 있는지 확인해 주세요.',
  );
};

type SavePartQuotasParams = {
  gisuId: number;
  projectId: number;
  chapterId: number;
  recruit: RecruitInfo;
};

export const savePartQuotas = ({ gisuId, projectId, chapterId, recruit }: SavePartQuotasParams) =>
  saveQuotaManagement({
    gisuId,
    chapterId,
    projects: [{ projectId, entries: toPartQuotaEntries(recruit) }],
  });
