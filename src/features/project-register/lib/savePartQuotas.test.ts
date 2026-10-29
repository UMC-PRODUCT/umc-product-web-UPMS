import { findProjectChapterId } from './savePartQuotas';

const projectsByChapter: Record<number, string[] | 'ERROR'> = {};

vi.mock('../api/partQuotaManagement', () => ({
  getQuotaManagement: vi.fn(async ({ chapterId }: { chapterId?: number }) => {
    const id = chapterId ?? 33;
    const projects = projectsByChapter[id];
    if (projects === 'ERROR') throw new Error('500');
    return {
      chapterId: String(id),
      chapters: [
        { chapterId: '33' },
        { chapterId: '37' },
        { chapterId: '42' },
        { chapterId: '46' },
      ],
      projects: (projects ?? []).map((projectId) => ({ projectId })),
    };
  }),
  saveQuotaManagement: vi.fn(),
}));

beforeEach(() => {
  Object.keys(projectsByChapter).forEach((key) => delete projectsByChapter[Number(key)]);
});

describe('findProjectChapterId', () => {
  it('프로젝트가 들어 있는 지부를 찾는다', async () => {
    projectsByChapter[37] = ['10'];
    await expect(findProjectChapterId(6, 10)).resolves.toBe(37);
  });

  it('조회가 서버 오류로 실패한 지부는 건너뛰고 계속 찾는다', async () => {
    projectsByChapter[37] = 'ERROR';
    projectsByChapter[42] = 'ERROR';
    projectsByChapter[46] = ['10'];
    await expect(findProjectChapterId(6, 10)).resolves.toBe(46);
  });

  it('어느 지부에도 없으면 오류를 낸다', async () => {
    await expect(findProjectChapterId(6, 10)).rejects.toMatchObject({ code: 'CHAPTER_NOT_FOUND' });
  });
});
