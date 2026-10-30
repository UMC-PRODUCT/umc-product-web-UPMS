import { toId } from '@/shared/api/toId';

import type { ApplicationFormResponse } from '../api/applicationForm';
import type { DraftProjectResponse } from '../api/getMyDraftProject';
import { createInitialDraft } from '../model/draft';
import type { ProjectDraft } from '../model/types';
import { fromApplicationForm } from './toApplicationForm';
import { fromPartQuotas } from './toPartQuotas';

type PartQuotas = Parameters<typeof fromPartQuotas>[0];

const memberIdOf = (member: { memberId?: unknown } | undefined) => {
  const id = toId(member?.memberId);
  return id === null ? '' : String(id);
};

// 서버에 저장된 초안을 화면 초안으로 되돌림. 이미지는 파일이 아니라 주소만 있어서 주소로 보여주고, 새로 고를 때만 다시 올림
export const fromServerDraft = (
  draft: DraftProjectResponse,
  partQuotas: PartQuotas,
  form: ApplicationFormResponse | null,
): ProjectDraft => {
  const initial = createInitialDraft();
  const coPmId = memberIdOf(draft.coProductOwners?.[0]);
  const mainPmId = memberIdOf(draft.productOwner);

  return {
    ...initial,
    thumbnailUrl: draft.thumbnailImageUrl ?? '',
    logoUrl: draft.logoImageUrl ?? '',
    name: draft.name ?? '',
    description: draft.description ?? '',
    planUrl: draft.externalLink ?? '',
    pmIds: coPmId ? [mainPmId, coPmId] : [mainPmId],
    recruit: fromPartQuotas(partQuotas) ?? initial.recruit,
    ...fromApplicationForm(form),
  };
};
