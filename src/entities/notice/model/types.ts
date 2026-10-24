export type Notice = {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  createdAt: string; // YYYY-MM-DD
  required: boolean; // 필독 공지
};
