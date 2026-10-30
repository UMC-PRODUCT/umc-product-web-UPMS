import {
  getProjectActions,
  NOTICE_ALREADY_APPLIED,
  NOTICE_NOT_APPLY_PERIOD,
  NOTICE_PART_MISMATCH,
  NOTICE_RECRUIT_CLOSED,
} from './getProjectActions';
import type { PartRecruitment, Project, ProjectPeriod, ProjectViewer } from './types';

const recruit = (
  part: PartRecruitment['part'],
  status: PartRecruitment['status'],
): PartRecruitment => ({ part, applied: 0, capacity: 1, status, members: [] });

const PROJECT: Project = {
  projectId: 'p1',
  projectName: 'UMC Web',
  logoUrl: null,
  thumbnailUrl: null,
  pmName: '닉네임/이름',
  schoolName: '중앙대',
  chapterId: 'otter',
  description: '',
  platform: 'WEB',
  planUrl: null,
  recruitments: [recruit('DESIGN', 'RECRUITING'), recruit('WEB_PE', 'RECRUITING')],
};

const APPLY: ProjectPeriod = { track: 'PE', phase: 'APPLY', round: 1 };
const MATCHING: ProjectPeriod = { track: 'PE', phase: 'MATCHING', round: 1 };

const VIEWER: ProjectViewer = {
  challengerPart: 'DESIGN',
  myProjectId: null,
  appliedProjectId: null,
  isMatched: false,
};

const base = { chapterId: 'otter', project: PROJECT, period: APPLY, viewer: VIEWER };

describe('getProjectActions - 일반 챌린저', () => {
  const challenger = { ...base, role: 'CHALLENGER' as const, view: 'CHALLENGER' as const };

  it('본인 지부 프로젝트에 지원 기간이면 지원하기가 활성이다', () => {
    expect(getProjectActions(challenger).primary).toEqual({
      kind: 'APPLY',
      label: '지원하기',
      disabled: false,
      notice: null,
    });
  });

  it('매칭 기간이면 지원하기가 비활성이다', () => {
    expect(getProjectActions({ ...challenger, period: MATCHING }).primary).toMatchObject({
      disabled: true,
      notice: NOTICE_NOT_APPLY_PERIOD,
    });
  });

  it('타 지부 프로젝트는 기획보기만 보인다', () => {
    expect(getProjectActions({ ...challenger, chapterId: 'quokka' }).primary).toBeNull();
  });

  it('이미 매칭된 챌린저는 기획보기만 보인다', () => {
    const viewer = { ...VIEWER, isMatched: true };
    expect(getProjectActions({ ...challenger, viewer }).primary).toBeNull();
  });

  it('지원한 프로젝트는 내 지원서 보기가 지원 기간에만 활성이다', () => {
    const viewer = { ...VIEWER, appliedProjectId: 'p1' };
    expect(getProjectActions({ ...challenger, viewer }).primary).toMatchObject({
      kind: 'MY_APPLICATION',
      disabled: false,
    });
    expect(getProjectActions({ ...challenger, viewer, period: MATCHING }).primary).toMatchObject({
      kind: 'MY_APPLICATION',
      disabled: true,
      notice: NOTICE_NOT_APPLY_PERIOD,
    });
  });

  it('다른 프로젝트에 이미 지원했으면 지원하기가 비활성이다', () => {
    const viewer = { ...VIEWER, appliedProjectId: 'p2' };
    expect(getProjectActions({ ...challenger, viewer }).primary).toMatchObject({
      disabled: true,
      notice: NOTICE_ALREADY_APPLIED,
    });
  });

  it('모집 파트가 다르면 지원하기가 비활성이다', () => {
    const project = { ...PROJECT, recruitments: [recruit('WEB_PE', 'RECRUITING')] };
    expect(getProjectActions({ ...challenger, project }).primary).toMatchObject({
      disabled: true,
      notice: NOTICE_PART_MISMATCH,
    });
  });

  it('전 파트가 마감이면 모집 마감 안내가 파트 불일치 · 이미 지원 안내보다 먼저다', () => {
    const project = { ...PROJECT, recruitments: [recruit('WEB_PE', 'CLOSED')] };
    const viewer = { ...VIEWER, appliedProjectId: 'p2' };
    expect(getProjectActions({ ...challenger, project, viewer }).primary).toMatchObject({
      notice: NOTICE_RECRUIT_CLOSED,
    });
  });

  it('내 파트만 마감이어도 모집 마감 안내가 나온다', () => {
    const project = {
      ...PROJECT,
      recruitments: [recruit('DESIGN', 'CLOSED'), recruit('WEB_PE', 'RECRUITING')],
    };
    expect(getProjectActions({ ...challenger, project }).primary).toMatchObject({
      notice: NOTICE_RECRUIT_CLOSED,
    });
  });
});

describe('getProjectActions - 운영진 · PM', () => {
  it('지원 기간에는 모든 프로젝트에서 모집 문항 보기가 활성이다', () => {
    const action = getProjectActions({ ...base, role: 'SUPER_ADMIN', view: 'ADMIN' }).primary;
    expect(action).toMatchObject({ kind: 'RECRUIT_QUESTIONS', disabled: false });
  });

  it('매칭 기간에 마스터는 모든 프로젝트를 수정할 수 있다', () => {
    const action = getProjectActions({
      ...base,
      role: 'HQ_LEAD',
      view: 'ADMIN',
      chapterId: 'quokka',
      period: MATCHING,
    }).primary;
    expect(action).toMatchObject({ kind: 'EDIT_PROJECT', disabled: false });
  });

  it('매칭 기간에 지부장은 소속 지부 프로젝트만 수정할 수 있다', () => {
    const chapterAdmin = { ...base, role: 'CHAPTER_ADMIN' as const, view: 'ADMIN' as const };
    expect(getProjectActions({ ...chapterAdmin, period: MATCHING }).primary).toMatchObject({
      kind: 'EDIT_PROJECT',
    });
    expect(
      getProjectActions({ ...chapterAdmin, chapterId: 'quokka', period: MATCHING }).primary,
    ).toMatchObject({
      kind: 'RECRUIT_QUESTIONS',
      disabled: true,
      notice: NOTICE_NOT_APPLY_PERIOD,
    });
  });

  it('매칭 기간에 PM은 본인 프로젝트만 수정할 수 있다', () => {
    const pm = { ...base, role: 'CHALLENGER_PM' as const, view: 'PM_CHALLENGER' as const };
    const viewer = { ...VIEWER, myProjectId: 'p1' };
    expect(getProjectActions({ ...pm, viewer, period: MATCHING }).primary).toMatchObject({
      kind: 'EDIT_PROJECT',
    });
    expect(
      getProjectActions({ ...pm, viewer: { ...viewer, myProjectId: 'p2' }, period: MATCHING })
        .primary,
    ).toMatchObject({ kind: 'RECRUIT_QUESTIONS', disabled: true });
  });

  it('지원 기간에는 PM도 본인 프로젝트를 수정할 수 없다', () => {
    const viewer = { ...VIEWER, myProjectId: 'p1' };
    const action = getProjectActions({
      ...base,
      role: 'CHALLENGER_PM',
      view: 'PM_CHALLENGER',
      viewer,
    }).primary;
    expect(action).toMatchObject({ kind: 'RECRUIT_QUESTIONS', disabled: false });
  });

  it('중앙운영진은 기획보기만 보인다', () => {
    expect(getProjectActions({ ...base, role: 'HQ_ADMIN', view: 'ADMIN' }).primary).toBeNull();
  });
});

describe('getProjectActions - 팀원 구성', () => {
  const admin = { ...base, role: 'SUPER_ADMIN' as const, view: 'ADMIN' as const };

  it('차수 · 지원 기간 · 매칭 기간과 관계없이 항상 보인다', () => {
    for (const phase of ['APPLY', 'MATCHING'] as const) {
      for (const round of [1, 2, 3] as const) {
        expect(
          getProjectActions({ ...admin, period: { track: 'PE', phase, round } }).showTeamButton,
        ).toBe(true);
      }
    }
  });
});
