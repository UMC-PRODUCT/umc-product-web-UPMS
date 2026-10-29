import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';

import { saveApplicationForm } from '../api/applicationForm';
import { createDraftProject } from '../api/createDraftProject';
import {
  addProjectMember,
  removeProjectMember,
  transferProjectOwnership,
} from '../api/projectMembers';
import { submitProject } from '../api/submitProject';
import { updateProject, type UpdateProjectRequest } from '../api/updateProject';
import { uploadProjectImage } from '../api/uploadProjectImage';
import { isRecruitComplete } from '../model/draft';
import type { ProjectDraft } from '../model/types';
import { findProjectChapterId, savePartQuotas } from './savePartQuotas';
import { toApplicationFormRequest } from './toApplicationForm';

// 서버에 이미 반영된 상태. 저장이 중간에 실패해도 다음 저장이 이어서 하도록, 호출하는 쪽이 들고 있다가 그대로 다시 넘김
export type ServerProjectState = {
  projectId: number | null;
  mainPmId: number | null;
  coPmId: number | null;
  chapterId: number | null; // 프로젝트의 지부 (정원 저장에 필요)
  uploadedThumbnail: File | null; // 이미 올린 파일은 다시 올리지 않음
  uploadedLogo: File | null;
};

export const createServerProjectState = (): ServerProjectState => ({
  projectId: null,
  mainPmId: null,
  coPmId: null,
  chapterId: null,
  uploadedThumbnail: null,
  uploadedLogo: null,
});

type SaveProjectParams = {
  gisuId: number | null;
  isAdmin: boolean; // 운영진만 PM 지정 · 모집 정보(정원) 입력
  chapterId?: number | null; // 지부장은 본인 지부가 곧 프로젝트 지부. 그 외에는 서버에서 찾음
  draft: ProjectDraft;
  server: ServerProjectState; // 저장하면서 바로 갱신됨
  submit: boolean; // true면 저장 뒤 제출까지
};

const NO_GISU = '기수 정보를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.';

const idOrNull = (value: string | undefined) => (value ? toId(value) : null);

// 임시 저장 · 등록: 서버는 초안 프로젝트를 먼저 만들고 항목별로 저장하는 구조라 순서대로 호출
// 초안 생성 → (운영진) PM 변경 → 이미지 → 기본 정보 → (운영진) 정원 → 지원 폼 → (등록이면) 제출
export const saveProject = async ({
  gisuId,
  isAdmin,
  chapterId: ownChapterId = null,
  draft,
  server,
  submit,
}: SaveProjectParams): Promise<number> => {
  if (gisuId === null) throw new ApiError(0, 'NO_GISU', NO_GISU);

  const mainPmId = isAdmin ? idOrNull(draft.pmIds[0]) : null;
  const coPmId = isAdmin ? idOrNull(draft.pmIds[1]) : null;

  if (server.projectId === null) {
    // PM 본인 등록은 PM을 보내지 않음 (본인이 PM)
    const created = await createDraftProject({
      gisuId,
      productOwnerMemberId: mainPmId ?? undefined,
    });
    server.projectId = toId(created.projectId);
    server.mainPmId = mainPmId;
  }
  const projectId = server.projectId;
  if (projectId === null) throw new ApiError(0, 'NO_PROJECT', '프로젝트를 만들지 못했어요.');

  // 이미 만든 초안의 메인 PM을 바꾼 경우
  if (isAdmin && mainPmId !== null && server.mainPmId !== null && mainPmId !== server.mainPmId) {
    await transferProjectOwnership(projectId, { newOwnerMemberId: mainPmId });
    server.mainPmId = mainPmId;
  }
  // 보조 PM 추가 · 변경 · 제거
  if (isAdmin && coPmId !== server.coPmId) {
    if (server.coPmId !== null) await removeProjectMember(projectId, server.coPmId);
    server.coPmId = null;
    if (coPmId !== null) {
      await addProjectMember(projectId, { memberId: coPmId, part: 'PLAN' });
      server.coPmId = coPmId;
    }
  }

  const info: UpdateProjectRequest = {};
  if (draft.name.trim()) info.name = draft.name.trim();
  if (draft.description.trim()) info.description = draft.description.trim();
  if (draft.planUrl.trim()) info.externalLink = draft.planUrl.trim();
  if (draft.thumbnail && draft.thumbnail !== server.uploadedThumbnail) {
    info.thumbnailFileId = await uploadProjectImage(draft.thumbnail, 'PROJECT_THUMBNAIL');
    server.uploadedThumbnail = draft.thumbnail;
  }
  if (draft.logo && draft.logo !== server.uploadedLogo) {
    info.logoFileId = await uploadProjectImage(draft.logo, 'PROJECT_LOGO');
    server.uploadedLogo = draft.logo;
  }
  if (Object.keys(info).length > 0) await updateProject(projectId, info);

  // 정원은 운영진만 정함. 모집 정보가 채워졌을 때만 보냄
  if (isAdmin && isRecruitComplete(draft.recruit)) {
    server.chapterId ??= ownChapterId ?? (await findProjectChapterId(gisuId, projectId));
    await savePartQuotas({
      gisuId,
      projectId,
      chapterId: server.chapterId,
      recruit: draft.recruit,
    });
  }

  const hasQuestions = Object.values(draft.questions).some((questions) => questions.length > 0);
  if (hasQuestions) await saveApplicationForm(projectId, toApplicationFormRequest(draft));

  if (submit) await submitProject(projectId);
  return projectId;
};
