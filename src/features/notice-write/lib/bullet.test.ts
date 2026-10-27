import { continueBullet, convertDashToBullet } from './bullet';

describe('convertDashToBullet', () => {
  it('줄 맨 앞의 "- "를 불렛으로 바꾼다', () => {
    expect(convertDashToBullet({ value: '- ', start: 2, end: 2 })).toEqual({
      value: '· ',
      start: 2,
      end: 2,
    });
  });

  it('둘째 줄 맨 앞에서도 바꾼다', () => {
    expect(convertDashToBullet({ value: '안녕\n- 뒷글', start: 5, end: 5 })).toEqual({
      value: '안녕\n· 뒷글',
      start: 5,
      end: 5,
    });
  });

  it('줄 중간의 "- "는 그대로 둔다', () => {
    expect(convertDashToBullet({ value: '가 - ', start: 4, end: 4 })).toBeNull();
  });
});

describe('continueBullet', () => {
  it('불렛 줄에서 Enter를 치면 다음 줄도 불렛으로 시작한다', () => {
    expect(continueBullet({ value: '· 첫째', start: 4, end: 4 })).toEqual({
      value: '· 첫째\n· ',
      start: 7,
      end: 7,
    });
  });

  it('줄 중간에서 치면 뒷글이 새 불렛으로 넘어간다', () => {
    expect(continueBullet({ value: '· 가나', start: 3, end: 3 })).toEqual({
      value: '· 가\n· 나',
      start: 6,
      end: 6,
    });
  });

  it('내용이 없는 불렛 줄에서 치면 불렛을 지운다', () => {
    expect(continueBullet({ value: '· 첫째\n· ', start: 7, end: 7 })).toEqual({
      value: '· 첫째\n',
      start: 5,
      end: 5,
    });
  });

  it('불렛이 아닌 줄이나 범위 선택은 건드리지 않는다', () => {
    expect(continueBullet({ value: '일반 줄', start: 3, end: 3 })).toBeNull();
    expect(continueBullet({ value: '· 가나', start: 2, end: 4 })).toBeNull();
  });
});
