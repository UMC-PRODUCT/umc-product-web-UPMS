import { toggleBold } from './toggleBold';

describe('toggleBold', () => {
  it('선택한 글자를 굵게 감싸고 선택을 유지한다', () => {
    expect(toggleBold({ value: '안녕 하세요', start: 0, end: 2 })).toEqual({
      value: '**안녕** 하세요',
      start: 2,
      end: 4,
    });
  });

  it('선택이 없으면 빈 표식을 넣고 커서를 그 안에 둔다', () => {
    expect(toggleBold({ value: '안녕', start: 2, end: 2 })).toEqual({
      value: '안녕****',
      start: 4,
      end: 4,
    });
  });

  it('이미 굵게 감싸진 글자를 다시 누르면 푼다', () => {
    expect(toggleBold({ value: '**안녕** 하세요', start: 2, end: 4 })).toEqual({
      value: '안녕 하세요',
      start: 0,
      end: 2,
    });
  });

  it('표식까지 포함해 선택해도 푼다', () => {
    expect(toggleBold({ value: '**안녕**', start: 0, end: 6 })).toEqual({
      value: '안녕',
      start: 0,
      end: 2,
    });
  });
});
