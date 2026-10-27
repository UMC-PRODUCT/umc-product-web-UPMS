import { MOCK_CHAPTERS } from '@/entities/chapter';

import type { PmCandidate, RecruitInfo } from './types';

// TODO: PM 후보 조회 API 연동. 지금은 지부별 학교마다 PM 한 명씩 있는 mock
export const MOCK_PM_CANDIDATES: PmCandidate[] = MOCK_CHAPTERS.flatMap(({ id, schools }) =>
  schools.map((schoolName, index) => ({
    id: `${id}-${index}`,
    nickname: `닉네임${index + 1}`,
    name: `이름${index + 1}`,
    chapterId: id,
    schoolName,
  })),
);

// TODO: 로그인 사용자 정보 API 연동. PM이 등록할 때 프로젝트 카드에 미리 채워지는 본인 정보
export const MOCK_MY_PM: Pick<PmCandidate, 'nickname' | 'name' | 'schoolName'> = {
  nickname: '닉네임',
  name: '이름',
  schoolName: '한국대',
};

// TODO: 모집 정보 조회 API 연동. PM이 2단계에서 보는, 운영진이 설정해 둔 모집 정보 (null이면 아직 설정 전)
export const MOCK_ADMIN_RECRUIT: RecruitInfo | null = null;
