import type { Role, View } from '../model/types';
import {
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
