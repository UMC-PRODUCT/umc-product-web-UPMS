export type Notice = {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  createdAt: string; // YYYY-MM-DD
  required: boolean; // 필독 공지
};

// 공지 작성·수정 폼에서 받는 값
export type NoticeInput = Pick<Notice, 'title' | 'content' | 'required'>;

export const NOTICE_CONTENT_MAX_LENGTH = 2000;
