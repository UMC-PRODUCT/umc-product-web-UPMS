import { createInitialDraft, createQuestion } from '../model/draft';
import type { PePlatform } from '../model/types';
import { fromApplicationForm, toApplicationFormRequest } from './toApplicationForm';

const draftWithQuestions = () => {
  const single = { ...createQuestion('SINGLE'), title: '선호 파트', required: false };
  single.choices = [
    { id: 'a', label: 'Web' },
    { id: 'b', label: 'Mobile' },
  ];
  return {
    ...createInitialDraft(),
    recruit: { designCount: 1, peCount: 2, pePlatform: 'MOBILE' as PePlatform | null },
    questions: {
      COMMON: [{ ...createQuestion('SHORT'), title: '지원 동기' }],
      DESIGN: [],
      PE: [single],
    },
    sectionEnabled: { DESIGN: false, PE: true },
  };
};

describe('toApplicationFormRequest', () => {
  it('공통 섹션은 항상, 켜 둔 파트 섹션만 보낸다', () => {
    const { sections } = toApplicationFormRequest(draftWithQuestions());
    expect(sections.map(({ type, allowedParts }) => [type, allowedParts])).toEqual([
      ['COMMON', undefined],
      ['PART', ['MOBILE_PRODUCT_ENGINEER']],
    ]);
  });

  it('질문 유형 · 필수 여부 · 선택지를 서버 형식으로 바꾼다', () => {
    const [common, pe] = toApplicationFormRequest(draftWithQuestions()).sections;
    expect(common.questions[0]).toMatchObject({
      type: 'SHORT_TEXT',
      isRequired: true,
      options: [],
    });
    expect(pe.questions[0]).toMatchObject({
      type: 'RADIO',
      isRequired: false,
      options: [
        { content: 'Web', orderNo: 1 },
        { content: 'Mobile', orderNo: 2 },
      ],
    });
  });

  it('플랫폼을 모르면 PE 섹션은 Web · Mobile PE 모두 대상이다', () => {
    const draft = draftWithQuestions();
    draft.recruit.pePlatform = null;
    const pe = toApplicationFormRequest(draft).sections[1];
    expect(pe.allowedParts).toEqual(['WEB_PRODUCT_ENGINEER', 'MOBILE_PRODUCT_ENGINEER']);
  });
});

describe('fromApplicationForm', () => {
  it('서버 지원 폼을 화면 문항으로 되돌린다', () => {
    const request = toApplicationFormRequest(draftWithQuestions());
    const restored = fromApplicationForm({ projectId: 1, ...request });
    expect(restored.sectionEnabled).toEqual({ DESIGN: false, PE: true });
    expect(restored.questions.COMMON[0]).toMatchObject({ type: 'SHORT', title: '지원 동기' });
    expect(restored.questions.PE[0]).toMatchObject({ type: 'SINGLE', required: false });
    expect(restored.questions.PE[0].choices.map(({ label }) => label)).toEqual(['Web', 'Mobile']);
  });

  it('폼이 없으면 빈 문항이다', () => {
    expect(fromApplicationForm(null).questions).toEqual({ COMMON: [], DESIGN: [], PE: [] });
  });
});
