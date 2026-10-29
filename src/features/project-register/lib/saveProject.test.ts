import { createInitialDraft } from '../model/draft';
import type { ProjectDraft } from '../model/types';
import { createServerProjectState, saveProject } from './saveProject';

const calls: string[] = [];

vi.mock('../api/createDraftProject', () => ({
  createDraftProject: vi.fn(async () => {
    calls.push('create');
    return { projectId: '10' };
  }),
}));
vi.mock('../api/updateProject', () => ({
  updateProject: vi.fn(async (_id: number, body: object) => {
    calls.push(`update:${JSON.stringify(body)}`);
  }),
}));
vi.mock('../api/partQuotaManagement', () => ({
  getQuotaManagement: vi.fn(async (query: { chapterId?: number }) => {
    calls.push(`chapters:${query.chapterId ?? 'default'}`);
    return query.chapterId === 37
      ? { chapterId: '37', projects: [{ projectId: '10' }] }
      : { chapterId: '33', chapters: [{ chapterId: '33' }, { chapterId: '37' }], projects: [] };
  }),
  saveQuotaManagement: vi.fn(async (body: object) => {
    calls.push(`quotas:${JSON.stringify(body)}`);
  }),
}));
vi.mock('../api/applicationForm', () => ({
  saveApplicationForm: vi.fn(async () => {
    calls.push('form');
  }),
}));
vi.mock('../api/submitProject', () => ({
  submitProject: vi.fn(async () => {
    calls.push('submit');
  }),
}));
vi.mock('../api/projectMembers', () => ({
  addProjectMember: vi.fn(async (_id: number, body: { memberId: number }) => {
    calls.push(`addPm:${body.memberId}`);
  }),
  removeProjectMember: vi.fn(async (_id: number, memberId: number) => {
    calls.push(`removePm:${memberId}`);
  }),
  transferProjectOwnership: vi.fn(async (_id: number, body: { newOwnerMemberId: number }) => {
    calls.push(`transfer:${body.newOwnerMemberId}`);
  }),
}));
vi.mock('../api/uploadProjectImage', () => ({
  uploadProjectImage: vi.fn(async (file: File) => {
    calls.push(`upload:${file.name}`);
    return `file-${file.name}`;
  }),
}));

const image = (name: string) => new File(['x'], name, { type: 'image/png' });

const filled = (patch: Partial<ProjectDraft> = {}): ProjectDraft => ({
  ...createInitialDraft(),
  name: ' 프로젝트 ',
  description: '소개',
  planUrl: 'https://notion.so',
  thumbnail: image('thumb.png'),
  logo: image('logo.png'),
  pmIds: ['1', '2'],
  recruit: { designCount: 1, peCount: 0, pePlatform: null },
  ...patch,
});

beforeEach(() => {
  calls.length = 0;
});

describe('saveProject', () => {
  it('기수를 모르면 저장하지 않는다', async () => {
    await expect(
      saveProject({
        gisuId: null,
        isAdmin: true,
        draft: filled(),
        server: createServerProjectState(),
        submit: false,
      }),
    ).rejects.toMatchObject({ code: 'NO_GISU' });
    expect(calls).toEqual([]);
  });

  it('운영진 등록: 초안 생성 → 보조 PM → 이미지 → 기본 정보 → 정원 순서로 호출한다', async () => {
    const server = createServerProjectState();
    await saveProject({ gisuId: 6, isAdmin: true, draft: filled(), server, submit: false });

    expect(calls).toEqual([
      'create',
      'addPm:2',
      'upload:thumb.png',
      'upload:logo.png',
      'update:{"name":"프로젝트","description":"소개","externalLink":"https://notion.so","thumbnailFileId":"file-thumb.png","logoFileId":"file-logo.png"}',
      'chapters:default',
      'chapters:37',
      'quotas:{"gisuId":6,"chapterId":37,"projects":[{"projectId":10,"entries":[{"part":"DESIGN","quota":1},{"part":"WEB_PRODUCT_ENGINEER","quota":0},{"part":"MOBILE_PRODUCT_ENGINEER","quota":0}]}]}',
    ]);
    expect(server).toMatchObject({ projectId: 10, mainPmId: 1, coPmId: 2 });
  });

  it('PM 본인 등록은 PM · 정원을 보내지 않고 문항이 있을 때만 지원 폼을 보낸다', async () => {
    const draft = filled({
      thumbnail: null,
      logo: null,
      questions: {
        COMMON: [
          { id: 'q', type: 'SHORT', title: '동기', description: '', required: true, choices: [] },
        ],
        DESIGN: [],
        PE: [],
      },
    });
    await saveProject({
      gisuId: 6,
      isAdmin: false,
      draft,
      server: createServerProjectState(),
      submit: true,
    });

    expect(calls.map((call) => call.split(':')[0])).toEqual(['create', 'update', 'form', 'submit']);
  });

  it('만든 초안은 다시 만들지 않고, 올린 이미지는 다시 올리지 않으며, PM을 바꾸면 양도한다', async () => {
    const draft = filled({ pmIds: ['3'] });
    const server = {
      ...createServerProjectState(),
      projectId: 10,
      mainPmId: 1,
      coPmId: 2,
      uploadedThumbnail: draft.thumbnail,
    };
    await saveProject({ gisuId: 6, isAdmin: true, draft, server, submit: false });

    expect(calls.slice(0, 3)).toEqual(['transfer:3', 'removePm:2', 'upload:logo.png']);
    expect(calls).not.toContain('create');
    expect(server).toMatchObject({ mainPmId: 3, coPmId: null });
  });
});
