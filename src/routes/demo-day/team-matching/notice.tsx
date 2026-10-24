import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@umc-product/react';
import { useState } from 'react';

import { getMockNotices } from '@/entities/notice';
import { useApplicationsView, useSessionStore } from '@/entities/session';
import { ChapterSelectHeader, useVisibleChapters } from '@/features/chapter-select';
import { NoticeList } from '@/features/notice-list';

const BREADCRUMBS = [{ label: '팀 매칭' }, { label: '공지' }];

const NoticePage = () => {
  const chapters = useVisibleChapters();
  const sessionChapterId = useSessionStore((state) => state.session.chapterId);
  // 챌린저에게는 지부 선택이 보이지 않는다
  const showChapterSelect = useApplicationsView() === 'ADMIN';

  // 본인 지부가 있으면 그 지부, 없으면 첫 지부를 기본 선택
  const defaultChapterId =
    chapters.find((chapter) => chapter.id === sessionChapterId)?.id ?? chapters[0]?.id ?? '';
  const [selectedChapterId, setSelectedChapterId] = useState(defaultChapterId);
  const chapterId = chapters.some((chapter) => chapter.id === selectedChapterId)
    ? selectedChapterId
    : defaultChapterId;

  // 피그마(1440 기준): 사이드바에서 콘텐츠까지 44px, 카드 오른쪽 끝에서 화면 끝까지 208px
  return (
    <div className="flex flex-col gap-8 pt-10 pr-52 pb-20 pl-11">
      <PageHeader
        breadcrumbs={BREADCRUMBS}
        title="공지"
        description="팀 매칭에 대한 지부별 공지를 모든 챌린저에게 안내합니다."
      />
      {showChapterSelect && (
        <ChapterSelectHeader value={chapterId} onValueChange={setSelectedChapterId} />
      )}
      {/* 지부를 바꾸면 목록을 새로 그려 펼침·페이지 상태를 초기화 */}
      <NoticeList key={chapterId} notices={getMockNotices(chapterId)} />
    </div>
  );
};

export const Route = createFileRoute('/demo-day/team-matching/notice')({
  component: NoticePage,
});
