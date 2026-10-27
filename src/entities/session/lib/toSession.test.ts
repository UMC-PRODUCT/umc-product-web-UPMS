import type { MyInfoResponse } from '../api/getMyInfo';
import { toSession } from './toSession';

type RoleTypes = NonNullable<MyInfoResponse['currentGisuMemberInfo']>['roleTypes'];
type Part = NonNullable<
  NonNullable<NonNullable<MyInfoResponse['currentGisuMemberInfo']>['challenger']>['part']
>;

const CURRENT_GISU = 11;

const me = ({
  isSuperAdmin = false,
  roleTypes = [],
  part,
}: { isSuperAdmin?: boolean; roleTypes?: RoleTypes; part?: Part } = {}): MyInfoResponse => ({
  isSuperAdmin,
  currentGisuMemberInfo: {
    gisuId: CURRENT_GISU,
    roleTypes,
    challenger: part ? { part } : undefined,
  },
  // 최신 기수 우선. 지난 기수는 다른 지부였던 경우
  challengerHistory: [
    { gisuId: CURRENT_GISU, chapterId: 3, chapterName: '캥거루' },
    { gisuId: 10, chapterId: 7, chapterName: '수달' },
  ],
});

describe('toSession', () => {
  it.each<[RoleTypes, string]>([
    [['CENTRAL_PRESIDENT'], 'HQ_LEAD'],
    [['CENTRAL_VICE_PRESIDENT'], 'HQ_LEAD'],
    [['CENTRAL_OPERATING_TEAM_MEMBER'], 'HQ_ADMIN'],
    [['CENTRAL_EDUCATION_TEAM_MEMBER'], 'HQ_ADMIN'],
    [['CHAPTER_PRESIDENT'], 'CHAPTER_ADMIN'],
    [['SCHOOL_PRESIDENT'], 'SCHOOL_ADMIN'],
    [['SCHOOL_VICE_PRESIDENT'], 'SCHOOL_ADMIN'],
    [['SCHOOL_PART_LEADER'], 'SCHOOL_STAFF'],
    [['SCHOOL_ETC_ADMIN'], 'SCHOOL_STAFF'],
  ])('운영진 역할 %s → %s', (roleTypes, role) => {
    expect(toSession(me({ roleTypes })).role).toBe(role);
  });

  it('역할이 여러 개면 높은 역할을 쓴다', () => {
    expect(toSession(me({ roleTypes: ['SCHOOL_PRESIDENT', 'CHAPTER_PRESIDENT'] })).role).toBe(
      'CHAPTER_ADMIN',
    );
  });

  it('슈퍼어드민은 운영진 역할보다 우선한다', () => {
    expect(toSession(me({ isSuperAdmin: true, roleTypes: ['CHAPTER_PRESIDENT'] })).role).toBe(
      'SUPER_ADMIN',
    );
  });

  it('운영진 역할이 없으면 파트가 PLAN인 챌린저는 PM, 나머지는 챌린저', () => {
    expect(toSession(me({ part: 'PLAN' })).role).toBe('CHALLENGER_PM');
    expect(toSession(me({ part: 'DESIGN' })).role).toBe('CHALLENGER');
    expect(toSession(me()).role).toBe('CHALLENGER');
  });

  it('챌린저로도 활동하는 운영진만 챌린저 유형이 있다', () => {
    expect(toSession(me({ roleTypes: ['CHAPTER_PRESIDENT'], part: 'PLAN' })).challengerType).toBe(
      'PM',
    );
    expect(toSession(me({ roleTypes: ['CHAPTER_PRESIDENT'], part: 'WEB' })).challengerType).toBe(
      'GENERAL',
    );
    // 운영진 파트로만 등록된 운영진 · 일반 챌린저는 없음
    expect(
      toSession(me({ roleTypes: ['CHAPTER_PRESIDENT'], part: 'ADMIN' })).challengerType,
    ).toBeNull();
    expect(toSession(me({ part: 'PLAN' })).challengerType).toBeNull();
  });

  it('소속 지부는 현재 기수 기록의 지부', () => {
    expect(toSession(me())).toMatchObject({
      serverChapterId: 3,
      gisuId: CURRENT_GISU,
      chapterName: '캥거루',
    });
  });

  // 실제 서버는 ID를 문자열로 내려줌 (생성 타입은 number라 캐스팅)
  it('ID가 문자열로 와도 숫자로 맞춘다', () => {
    const response = {
      isSuperAdmin: false,
      currentGisuMemberInfo: { gisuId: '6', roleTypes: ['CHAPTER_PRESIDENT'] },
      challengerHistory: [{ gisuId: '6', chapterId: '3', chapterName: '캥거루' }],
    } as unknown as MyInfoResponse;

    expect(toSession(response)).toMatchObject({
      role: 'CHAPTER_ADMIN',
      gisuId: 6,
      serverChapterId: 3,
    });
  });

  it('지난 기수에만 있는 운영진 역할은 쓰지 않는다', () => {
    const response = {
      isSuperAdmin: false,
      currentGisuMemberInfo: { gisuId: '6', challenger: null, roleTypes: [] },
      challengerHistory: [
        { gisuId: '1', chapterId: '1', chapterName: 'GOAT', roleTypes: ['CHAPTER_PRESIDENT'] },
      ],
    } as unknown as MyInfoResponse;

    expect(toSession(response)).toMatchObject({
      role: 'CHALLENGER',
      gisuId: 6,
      serverChapterId: null,
    });
  });

  it('현재 기수 기록이 없으면 소속 지부 없음', () => {
    expect(
      toSession({
        ...me(),
        challengerHistory: [{ gisuId: 10, chapterId: 7, chapterName: '수달' }],
      }),
    ).toMatchObject({ serverChapterId: null, chapterName: null });
  });
});
