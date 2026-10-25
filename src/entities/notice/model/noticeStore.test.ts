import { useNoticeStore } from './noticeStore';

const INPUT = { title: '새 공지', content: '내용입니다.', required: false };
const AUTHOR = '지부장 윰씨/김유앤';

const titlesOf = (scope: string) =>
  (useNoticeStore.getState().byScope[scope] ?? []).map((n) => n.title);

beforeEach(() => {
  useNoticeStore.setState({ byScope: {} });
});

describe('noticeStore', () => {
  it('공지를 추가하면 해당 지부 목록 맨 앞에 들어가고 작성자가 남는다', () => {
    const notice = useNoticeStore
      .getState()
      .addNotice('PROJECT_SETTINGS', 'axolotl', INPUT, AUTHOR);

    expect(notice).toMatchObject({
      kind: 'PROJECT_SETTINGS',
      chapterId: 'axolotl',
      authorLabel: AUTHOR,
    });
    expect(titlesOf('PROJECT_SETTINGS:axolotl')[0]).toBe('새 공지');
    // 목 데이터 3개 + 새 공지
    expect(titlesOf('PROJECT_SETTINGS:axolotl')).toHaveLength(4);
  });

  it('다른 지부·다른 메뉴의 공지에는 영향을 주지 않는다', () => {
    useNoticeStore.getState().addNotice('PROJECT_SETTINGS', 'axolotl', INPUT, AUTHOR);

    expect(titlesOf('PROJECT_SETTINGS:otter')).toEqual([]);
    expect(titlesOf('TEAM_MATCHING:axolotl')).toEqual([]);
  });

  it('공지를 수정한다', () => {
    const { id } = useNoticeStore.getState().addNotice('TEAM_MATCHING', 'axolotl', INPUT, AUTHOR);

    useNoticeStore.getState().updateNotice('TEAM_MATCHING', 'axolotl', id, {
      title: '수정된 공지',
      content: '바뀐 내용',
      required: true,
    });

    const updated = useNoticeStore
      .getState()
      .byScope['TEAM_MATCHING:axolotl'].find((notice) => notice.id === id);
    expect(updated).toMatchObject({ title: '수정된 공지', content: '바뀐 내용', required: true });
  });

  it('공지를 삭제한다', () => {
    const { id } = useNoticeStore.getState().addNotice('TEAM_MATCHING', 'axolotl', INPUT, AUTHOR);

    useNoticeStore.getState().removeNotice('TEAM_MATCHING', 'axolotl', id);

    expect(titlesOf('TEAM_MATCHING:axolotl')).not.toContain('새 공지');
  });
});
