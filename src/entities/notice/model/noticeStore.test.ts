import { useNoticeStore } from './noticeStore';

const INPUT = { title: '새 공지', content: '내용입니다.', required: false };

const titlesOf = (chapterId: string) =>
  (useNoticeStore.getState().byChapter[chapterId] ?? []).map((notice) => notice.title);

beforeEach(() => {
  useNoticeStore.setState({ byChapter: {} });
});

describe('noticeStore', () => {
  it('공지를 추가하면 해당 지부 목록 맨 앞에 들어간다', () => {
    const notice = useNoticeStore.getState().addNotice('axolotl', INPUT);

    expect(notice.chapterId).toBe('axolotl');
    expect(titlesOf('axolotl')[0]).toBe('새 공지');
    // 목 데이터 3개 + 새 공지
    expect(titlesOf('axolotl')).toHaveLength(4);
  });

  it('다른 지부의 공지에는 영향을 주지 않는다', () => {
    useNoticeStore.getState().addNotice('axolotl', INPUT);

    expect(titlesOf('otter')).toEqual([]);
  });

  it('공지를 수정한다', () => {
    const { id } = useNoticeStore.getState().addNotice('axolotl', INPUT);

    useNoticeStore
      .getState()
      .updateNotice('axolotl', id, { title: '수정된 공지', content: '바뀐 내용', required: true });

    const updated = useNoticeStore.getState().byChapter.axolotl.find((notice) => notice.id === id);
    expect(updated).toMatchObject({ title: '수정된 공지', content: '바뀐 내용', required: true });
  });

  it('공지를 삭제한다', () => {
    const { id } = useNoticeStore.getState().addNotice('axolotl', INPUT);

    useNoticeStore.getState().removeNotice('axolotl', id);

    expect(titlesOf('axolotl')).not.toContain('새 공지');
  });
});
