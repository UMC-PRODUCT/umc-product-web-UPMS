import type { Role } from '@/entities/session';

const MOCK_NAME = '홍길동/홍길동'; // TODO: 사용자 정보 API가 나오면 닉네임/이름으로 교체

const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: '프로덕트',
  HQ_LEAD: '총괄',
  HQ_ADMIN: '중앙운영',
  CHAPTER_ADMIN: '지부장',
  SCHOOL_ADMIN: '교내 회장단',
  SCHOOL_STAFF: '교내 운영진',
  CHALLENGER_PM: 'PM 챌린저',
  CHALLENGER: '챌린저',
};

// 목록의 '작성자: 수달 지부장 윰씨/김유앤' 형태
export const getNoticeAuthorLabel = (role: Role, chapterName: string) => {
  if (role === 'SUPER_ADMIN') return 'UMC PRODUCT';
  if (role === 'CHAPTER_ADMIN') return `${chapterName} ${ROLE_LABEL[role]} ${MOCK_NAME}`;
  return `${ROLE_LABEL[role]} ${MOCK_NAME}`;
};
