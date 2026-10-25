// 목록에는 '26-04-17'처럼 연도 두 자리로 보여준다 (피그마 '26-00-00')
export const formatNoticeDate = (createdAt: string) => createdAt.slice(2);
