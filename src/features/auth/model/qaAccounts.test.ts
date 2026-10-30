import { parseQaAccounts } from './qaAccounts';

describe('parseQaAccounts', () => {
  it('"라벨=이메일" 목록을 계정으로 바꾼다', () => {
    expect(parseQaAccounts(' 최고 관리자=admin@umc.com , 지부장=chapter@umc.com')).toEqual([
      { label: '최고 관리자', email: 'admin@umc.com' },
      { label: '지부장', email: 'chapter@umc.com' },
    ]);
  });

  it('값이 없거나 형식이 틀린 항목은 뺀다', () => {
    expect(parseQaAccounts(undefined)).toEqual([]);
    expect(parseQaAccounts('지부장,=a@umc.com,PM=')).toEqual([]);
  });
});
