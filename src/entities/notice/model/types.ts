// 공지가 놓이는 메뉴. 같은 화면 구성을 쓰지만 대상 독자와 문구가 다르다.
export type NoticeKind = 'TEAM_MATCHING' | 'PROJECT_SETTINGS';

export type Notice = {
  id: string;
  kind: NoticeKind;
  chapterId: string;
  title: string;
  content: string;
  createdAt: string; // YYYY-MM-DD
  required: boolean; // 필독 공지
  authorLabel: string; // 목록에 보이는 작성자 (예: '수달 지부장 윰씨/김유앤', 'UMC PRODUCT')
  hardcoded?: boolean; // 프로덕트 팀이 코드로 넣는 공지라 수정·삭제할 수 없다
};

// 공지 작성·수정 폼에서 받는 값
export type NoticeInput = Pick<Notice, 'title' | 'content' | 'required'>;

// TODO: 제목 최대 글자수는 디자인에 정해져 있지 않다 (피그마 토스트가 '00자'). 정해지면 교체.
export const NOTICE_TITLE_MAX_LENGTH = 50;
export const NOTICE_CONTENT_MAX_LENGTH = 10000;
