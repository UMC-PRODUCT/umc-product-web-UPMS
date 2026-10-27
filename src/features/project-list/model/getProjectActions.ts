import type { Role, Session, View } from '@/entities/session';

import type { Project, ProjectPeriod, ProjectViewer } from './types';

export type ProjectActionKind = 'RECRUIT_QUESTIONS' | 'EDIT_PROJECT' | 'APPLY' | 'MY_APPLICATION';

export type ProjectAction = {
  kind: ProjectActionKind;
  label: string;
  disabled: boolean;
  notice: string | null; // 버튼이 비활성인 이유 (버튼 아래 안내 문구)
};

export type ProjectActions = {
  // 기획보기 옆 주 버튼. 없으면 기획보기만 보임
  primary: ProjectAction | null;
  showTeamButton: boolean; // 팀원 구성 보기
};

export const NOTICE_NOT_APPLY_PERIOD = '지금은 프로젝트 지원 기간이 아니에요';
export const NOTICE_PART_MISMATCH = '해당 프로젝트는 모집 파트가 달라 지원할 수 없어요';
export const NOTICE_RECRUIT_CLOSED = '모집이 마감된 프로젝트예요';
export const NOTICE_ALREADY_APPLIED = '이미 다른 프로젝트에 지원했어요';

const enabled = (kind: ProjectActionKind, label: string): ProjectAction => ({
  kind,
  label,
  disabled: false,
  notice: null,
});

const disabled = (kind: ProjectActionKind, label: string, notice: string): ProjectAction => ({
  kind,
  label,
  disabled: true,
  notice,
});

type GetProjectActionsParams = {
  role: Role;
  chapterId: Session['chapterId']; // 로그인한 사용자의 소속 지부
  view: View;
  project: Project;
  period: ProjectPeriod;
  viewer: ProjectViewer;
};

// 운영진 · PM 뷰: 지원 기간에는 모집 문항 보기, 매칭 기간에는 수정 권한이 있는 프로젝트만 수정하기
// 수정 권한: 마스터(전 지부) · 지부장(소속 지부) · PM(본인 프로젝트). PM은 지원 기간에 수정할 수 없음
const getStaffPrimaryAction = ({
  role,
  chapterId,
  view,
  project,
  period,
  viewer,
}: GetProjectActionsParams): ProjectAction | null => {
  // TODO: 중앙운영진(HQ_ADMIN)은 프로젝트 목록만 볼 수 있고 상세 접근은 불가 (권한 정리 기준)
  if (view === 'ADMIN' && role === 'HQ_ADMIN') return null;

  const isOwnProject = view === 'PM_CHALLENGER' && viewer.myProjectId === project.projectId;
  const canEdit =
    isOwnProject ||
    (view === 'ADMIN' &&
      (role === 'SUPER_ADMIN' ||
        role === 'HQ_LEAD' ||
        (role === 'CHAPTER_ADMIN' && chapterId !== null && chapterId === project.chapterId)));

  if (period.phase === 'APPLY') return enabled('RECRUIT_QUESTIONS', '모집 문항 보기');
  if (canEdit) return enabled('EDIT_PROJECT', '프로젝트 수정하기');
  return disabled('RECRUIT_QUESTIONS', '모집 문항 보기', NOTICE_NOT_APPLY_PERIOD);
};

// 일반 챌린저 뷰: 본인 지부 프로젝트에만 지원하기 · 내 지원서 보기가 나옴 (그 외는 기획보기만)
// 안내 문구 우선순위: 모집 마감 > 모집 파트 불일치 > 이미 다른 프로젝트에 지원 > 지원 기간 아님
const getChallengerPrimaryAction = ({
  chapterId,
  project,
  period,
  viewer,
}: GetProjectActionsParams): ProjectAction | null => {
  if (chapterId === null || chapterId !== project.chapterId) return null;
  if (viewer.isMatched) return null;

  if (viewer.appliedProjectId === project.projectId) {
    return period.phase === 'APPLY'
      ? enabled('MY_APPLICATION', '내 지원서 보기')
      : disabled('MY_APPLICATION', '내 지원서 보기', NOTICE_NOT_APPLY_PERIOD);
  }

  const myPart = project.recruitments.find(({ part }) => part === viewer.challengerPart);
  const isProjectClosed = project.recruitments.every(({ status }) => status === 'CLOSED');

  if (isProjectClosed) return disabled('APPLY', '지원하기', NOTICE_RECRUIT_CLOSED);
  if (!myPart) return disabled('APPLY', '지원하기', NOTICE_PART_MISMATCH);
  if (myPart.status === 'CLOSED') return disabled('APPLY', '지원하기', NOTICE_RECRUIT_CLOSED);
  if (viewer.appliedProjectId !== null) {
    return disabled('APPLY', '지원하기', NOTICE_ALREADY_APPLIED);
  }
  if (period.phase === 'MATCHING') return disabled('APPLY', '지원하기', NOTICE_NOT_APPLY_PERIOD);
  return enabled('APPLY', '지원하기');
};

// 피그마 프로젝트 상세 모달: 권한 · 기간 · 지원 상태에 따라 하단 버튼이 달라짐
export const getProjectActions = (params: GetProjectActionsParams): ProjectActions => ({
  primary:
    params.view === 'CHALLENGER'
      ? getChallengerPrimaryAction(params)
      : getStaffPrimaryAction(params),
  // 매칭 기간이 끝나고 다음 차수 지원 기간이 되어야 팀원 구성을 볼 수 있음
  showTeamButton: params.period.phase === 'APPLY' && params.period.round >= 2,
});
