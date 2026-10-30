import {
  createInitialDraft,
  createQuestion,
  getTotalRecruitCount,
  hasDraftContent,
  isBasicInfoComplete,
  isQuestionsComplete,
  isRecruitComplete,
} from './draft';
import type { ProjectDraft } from './types';

const file = new File(['x'], 'x.png', { type: 'image/png' });

const filledDraft = (): ProjectDraft => ({
  ...createInitialDraft(),
  thumbnail: file,
  logo: file,
  name: '프로젝트',
  description: '소개',
  planUrl: 'https://notion.so',
  pmIds: ['axolotl-0'],
});

describe('hasDraftContent', () => {
  it('처음 상태는 작성한 내용이 없다', () => {
    expect(hasDraftContent(createInitialDraft())).toBe(false);
  });

  it('하나라도 입력하면 작성한 내용이 있다', () => {
    expect(hasDraftContent({ ...createInitialDraft(), name: 'a' })).toBe(true);
  });
});

describe('isBasicInfoComplete', () => {
  it('운영진은 PM까지 골라야 완료다', () => {
    expect(isBasicInfoComplete(filledDraft(), true)).toBe(true);
    expect(isBasicInfoComplete({ ...filledDraft(), pmIds: [''] }, true)).toBe(false);
  });

  it('PM 두 명을 쓰면 두 번째 PM도 골라야 한다', () => {
    expect(isBasicInfoComplete({ ...filledDraft(), pmIds: ['a', ''] }, true)).toBe(false);
  });

  it('PM 본인 등록은 PM 선택 없이 완료다', () => {
    expect(isBasicInfoComplete({ ...filledDraft(), pmIds: [''] }, false)).toBe(true);
  });

  it('썸네일이 없으면 미완료다', () => {
    expect(isBasicInfoComplete({ ...filledDraft(), thumbnail: null }, false)).toBe(false);
    // 이어 쓰는 초안은 파일 대신 서버에 저장된 이미지 주소가 있으면 채워진 것
    expect(
      isBasicInfoComplete(
        { ...filledDraft(), thumbnail: null, thumbnailUrl: 'https://img/t.png' },
        false,
      ),
    ).toBe(true);
  });
});

describe('isRecruitComplete', () => {
  it('총 모집 인원은 Design과 PE의 합이다', () => {
    expect(getTotalRecruitCount({ designCount: 2, peCount: 3, pePlatform: 'WEB' })).toBe(5);
  });

  it('인원이 0명이면 미완료다', () => {
    expect(isRecruitComplete({ designCount: 0, peCount: 0, pePlatform: null })).toBe(false);
  });

  it('PE를 모집하면 플랫폼을 골라야 한다', () => {
    expect(isRecruitComplete({ designCount: 1, peCount: 1, pePlatform: null })).toBe(false);
    expect(isRecruitComplete({ designCount: 1, peCount: 1, pePlatform: 'MOBILE' })).toBe(true);
    expect(isRecruitComplete({ designCount: 2, peCount: 0, pePlatform: null })).toBe(true);
  });
});

describe('isQuestionsComplete', () => {
  it('제목이 빈 문항이 있으면 미완료다', () => {
    const draft = filledDraft();
    draft.questions.COMMON = [createQuestion('SHORT')];
    expect(isQuestionsComplete(draft)).toBe(false);
    draft.questions.COMMON[0].title = '질문';
    expect(isQuestionsComplete(draft)).toBe(true);
  });

  it('꺼 둔 섹션의 빈 문항은 무시한다', () => {
    const draft = filledDraft();
    draft.questions.DESIGN = [createQuestion('SHORT')];
    expect(isQuestionsComplete(draft)).toBe(true);
    draft.sectionEnabled.DESIGN = true;
    expect(isQuestionsComplete(draft)).toBe(false);
  });

  it('선택 문항은 보기 내용까지 채워야 한다', () => {
    const draft = filledDraft();
    const question = createQuestion('SINGLE');
    question.title = '질문';
    draft.questions.COMMON = [question];
    expect(isQuestionsComplete(draft)).toBe(false);
    question.choices.forEach((choice) => (choice.label = '보기'));
    expect(isQuestionsComplete(draft)).toBe(true);
  });
});
