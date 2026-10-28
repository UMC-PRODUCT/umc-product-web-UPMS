import { useQuery } from '@tanstack/react-query';

import { myInfoQueryOptions, type Session, type View } from '@/entities/session';
import { toId } from '@/shared/api/toId';

import { getManagedProjects } from '../api/getManagedProjects';
import { getMyApplications } from '../api/getMyApplications';
import type { ProjectViewer, RecruitPart } from '../model/types';

const CHALLENGER_PART: Record<string, RecruitPart> = {
  DESIGN: 'DESIGN',
  WEB_PRODUCT_ENGINEER: 'WEB_PE',
  MOBILE_PRODUCT_ENGINEER: 'MOBILE_PE',
};

// 로그인한 사용자가 프로젝트와 맺은 관계 (상세 모달 버튼 구성에 쓰임)
// - 챌린저 뷰: 내 지원 내역으로 지원한 프로젝트 · 매칭 여부 (합격 · 랜덤 매칭 배정은 APPROVED)
// - PM 뷰: 내가 맡은 프로젝트
// 불러오는 중이거나 해당 없는 뷰는 관계 없음으로 취급
export const useProjectViewer = (session: Pick<Session, 'gisuId'>, view: View): ProjectViewer => {
  const { gisuId } = session;
  const { data: myInfo } = useQuery(myInfoQueryOptions);
  const { data: applications } = useQuery({
    queryKey: ['project-applications', 'me', gisuId],
    queryFn: () => getMyApplications(gisuId as number),
    enabled: gisuId !== null && view === 'CHALLENGER',
  });
  const { data: managed } = useQuery({
    queryKey: ['projects', 'managed', gisuId],
    queryFn: () => getManagedProjects(gisuId as number),
    enabled: gisuId !== null && view === 'PM_CHALLENGER',
  });

  const part = myInfo?.currentGisuMemberInfo?.challenger?.part;
  const appliedId = applications?.find(({ status }) => status === 'SUBMITTED')?.projectId;
  const myProjectId = toId(managed?.content?.[0]?.id);

  return {
    challengerPart: (part && CHALLENGER_PART[part]) || null,
    myProjectId: myProjectId === null ? null : String(myProjectId),
    appliedProjectId: toId(appliedId) === null ? null : String(toId(appliedId)),
    isMatched: applications?.some(({ status }) => status === 'APPROVED') ?? false,
  };
};
