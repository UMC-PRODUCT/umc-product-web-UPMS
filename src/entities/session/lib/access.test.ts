import type { Role, View } from '../model/types';
import {
  canEditApplicantStatus,
  getApplicationsView,
  getChapterScope,
  getProjectSettingsAccess,
  getViewOptions,
} from './access';

describe('getChapterScope', () => {
  it.each<[Role, 'ALL' | 'OWN']>([
    ['SUPER_ADMIN', 'ALL'],
    ['HQ_LEAD', 'ALL'],
    ['HQ_ADMIN', 'ALL'],
    ['CHAPTER_ADMIN', 'OWN'],
    ['SCHOOL_ADMIN', 'OWN'],
    ['SCHOOL_STAFF', 'OWN'],
  ])('%s의 지부 조회 범위는 %s', (role, expected) => {
    expect(getChapterScope(role)).toBe(expected);
  });
});

describe('getApplicationsView', () => {
  it.each<[Role, View]>([
    ['SUPER_ADMIN', 'ADMIN'],
    ['HQ_LEAD', 'ADMIN'],
    ['HQ_ADMIN', 'ADMIN'],
    ['CHAPTER_ADMIN', 'ADMIN'],
    ['SCHOOL_ADMIN', 'ADMIN'],
    ['SCHOOL_STAFF', 'ADMIN'],
    ['CHALLENGER_PM', 'PM_CHALLENGER'],
    ['CHALLENGER', 'CHALLENGER'],
  ])('Admin View에서 %s는 %s 화면을 본다', (role, expected) => {
    expect(getApplicationsView(role, 'ADMIN')).toBe(expected);
  });

  it('운영진도 챌린저 뷰로 전환하면 해당 챌린저 화면을 본다', () => {
    expect(getApplicationsView('HQ_ADMIN', 'PM_CHALLENGER')).toBe('PM_CHALLENGER');
    expect(getApplicationsView('SUPER_ADMIN', 'CHALLENGER')).toBe('CHALLENGER');
  });
});

describe('canEditApplicantStatus', () => {
  it.each<[Role, boolean]>([
    ['SUPER_ADMIN', true],
    ['HQ_LEAD', true],
    ['HQ_ADMIN', false],
    ['SCHOOL_ADMIN', false],
    ['SCHOOL_STAFF', false],
  ])('Admin View에서 %s의 배정 상태 변경 가능 여부는 %s', (role, expected) => {
    expect(canEditApplicantStatus({ role, chapterId: 'axolotl' }, 'ADMIN', 'axolotl')).toBe(
      expected,
    );
  });

  it('지부장은 본인 지부 프로젝트만 바꿀 수 있다', () => {
    const session = { role: 'CHAPTER_ADMIN' as const, chapterId: 'axolotl' };
    expect(canEditApplicantStatus(session, 'ADMIN', 'axolotl')).toBe(true);
    expect(canEditApplicantStatus(session, 'ADMIN', 'quokka')).toBe(false);
  });

  it('PM 뷰는 본인 프로젝트만 보이므로 바꿀 수 있고, 챌린저 뷰는 바꿀 수 없다', () => {
    const session = { role: 'CHALLENGER_PM' as const, chapterId: 'axolotl' };
    expect(canEditApplicantStatus(session, 'PM_CHALLENGER', null)).toBe(true);
    expect(canEditApplicantStatus(session, 'CHALLENGER', null)).toBe(false);
  });
});

describe('canManageMatching', () => {
  it.each<[Role, boolean]>([
    ['SUPER_ADMIN', true],
    ['HQ_LEAD', true],
    ['HQ_ADMIN', false],
    ['SCHOOL_ADMIN', false],
    ['SCHOOL_STAFF', false],
  ])('Admin View에서 %s의 수동 배정 · 매칭 해제 가능 여부는 %s', (role, expected) => {
    expect(canManageMatching({ role, chapterId: 'axolotl' }, 'ADMIN', 'axolotl')).toBe(expected);
  });

  it('지부장은 소속 지부 프로젝트만 수동 배정 · 매칭 해제할 수 있다', () => {
    const session = { role: 'CHAPTER_ADMIN' as const, chapterId: 'axolotl' };
    expect(canManageMatching(session, 'ADMIN', 'axolotl')).toBe(true);
    expect(canManageMatching(session, 'ADMIN', 'quokka')).toBe(false);
  });

  it('어드민 뷰가 아니면 조회만 가능하다', () => {
    const session = { role: 'SUPER_ADMIN' as const, chapterId: null };
    expect(canManageMatching(session, 'PM_CHALLENGER', null)).toBe(false);
    expect(canManageMatching(session, 'CHALLENGER', null)).toBe(false);
  });
});

describe('getMatchingScheduleAccess', () => {
  it.each<[Role, 'ALL' | 'OWN', boolean]>([
    ['SUPER_ADMIN', 'ALL', true],
    ['HQ_LEAD', 'ALL', true],
    ['HQ_ADMIN', 'ALL', false],
    ['CHAPTER_ADMIN', 'OWN', true],
  ])('%s는 %s 지부를 보고, 수정 가능 여부는 %s', (role, chapterScope, editable) => {
    expect(getMatchingScheduleAccess(role)).toEqual({ chapterScope, editable });
  });
});

describe('getProjectSettingsAccess', () => {
  it.each<[Role, 'FULL' | 'BASIC' | 'NONE']>([
    ['SUPER_ADMIN', 'FULL'],
    ['HQ_LEAD', 'FULL'],
    ['HQ_ADMIN', 'FULL'],
    ['CHAPTER_ADMIN', 'FULL'],
    ['SCHOOL_ADMIN', 'BASIC'],
    ['SCHOOL_STAFF', 'BASIC'],
    ['CHALLENGER_PM', 'BASIC'],
    ['CHALLENGER', 'NONE'],
  ])('Admin View에서 %s는 %s', (role, expected) => {
    expect(getProjectSettingsAccess(role, 'ADMIN')).toBe(expected);
  });

  it('챌린저 뷰로 전환하면 원래 권한과 상관없이 뷰 기준으로 접근한다', () => {
    expect(getProjectSettingsAccess('HQ_ADMIN', 'PM_CHALLENGER')).toBe('BASIC');
    expect(getProjectSettingsAccess('HQ_ADMIN', 'CHALLENGER')).toBe('NONE');
  });
});

describe('getViewOptions', () => {
  it('슈퍼 어드민은 세 가지 뷰를 모두 전환할 수 있다', () => {
    const options = getViewOptions({ role: 'SUPER_ADMIN', challengerType: null });
    expect(options.map((option) => option.value)).toEqual(['ADMIN', 'PM_CHALLENGER', 'CHALLENGER']);
  });

  it('PM을 겸하는 운영진은 PM 챌린저 뷰로 전환한다', () => {
    const options = getViewOptions({ role: 'SCHOOL_STAFF', challengerType: 'PM' });
    expect(options.map((option) => option.value)).toEqual(['ADMIN', 'PM_CHALLENGER']);
  });

  it('일반 챌린저를 겸하는 운영진은 챌린저 뷰로 전환한다', () => {
    const options = getViewOptions({ role: 'CHAPTER_ADMIN', challengerType: 'GENERAL' });
    expect(options.map((option) => option.value)).toEqual(['ADMIN', 'CHALLENGER']);
  });

  it('챌린저를 겸하지 않거나 전환 대상이 아닌 권한은 뷰 전환이 없다', () => {
    expect(getViewOptions({ role: 'HQ_ADMIN', challengerType: null })).toEqual([]);
    expect(getViewOptions({ role: 'HQ_LEAD', challengerType: 'PM' })).toEqual([]);
    expect(getViewOptions({ role: 'CHALLENGER', challengerType: 'GENERAL' })).toEqual([]);
  });
});
