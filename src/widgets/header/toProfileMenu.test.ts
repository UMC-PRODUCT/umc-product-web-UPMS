import type { MyInfoResponse } from '@/entities/session';

import { toProfileMenu } from './toProfileMenu';

// 서버는 ID를 문자열로 줌
const MY_INFO = {
  name: '박은솔',
  nickname: '솔',
  schoolName: '가천대학교',
  profileImageLink: '',
  currentGisuMemberInfo: { gisuId: '8' },
  challengerHistory: [
    { gisuId: '6', generation: 10, chapterName: '아홀로틀' },
    { gisuId: '8', generation: 11, chapterName: '티라노' },
  ],
} as unknown as MyInfoResponse;

describe('toProfileMenu', () => {
  it('프로필과 역할 태그를 만들고, 사진이 없으면 기본 그림을 쓴다', () => {
    expect(toProfileMenu(MY_INFO, 'CHAPTER_ADMIN').profile).toEqual({
      nickname: '솔',
      name: '박은솔',
      school: '가천대학교',
      role: { label: '지부장', color: 'chapter' },
      imageSrc: undefined,
    });
  });

  it('기수를 최신순으로 두고 현재 기수만 고를 수 있다', () => {
    const { generations, generation } = toProfileMenu(MY_INFO, 'CHALLENGER');

    expect(generation).toBe('8');
    expect(generations).toEqual([
      { value: '8', label: '11기', caption: '티라노', disabled: false },
      { value: '6', label: '10기', caption: '아홀로틀', disabled: true },
    ]);
  });
});
