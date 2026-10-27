import { filterProjects } from './filterProjects';
import { INITIAL_PROJECT_FILTERS } from './projectFilters';
import type { PartRecruitment, Project } from './types';

const recruit = (status: PartRecruitment['status']): PartRecruitment => ({
  part: 'DESIGN',
  applied: 0,
  capacity: 1,
  status,
  members: [],
});

const project = (overrides: Partial<Project>): Project => ({
  projectId: 'p',
  projectName: 'UMC Web',
  logoUrl: null,
  thumbnailUrl: null,
  pmName: '닉네임/이름',
  schoolName: '중앙대',
  chapterId: 'otter',
  description: '',
  platform: 'WEB',
  planUrl: null,
  recruitments: [recruit('RECRUITING')],
  ...overrides,
});

const PROJECTS = [
  project({ projectId: 'a', projectName: 'UMC Web' }),
  project({
    projectId: 'b',
    projectName: '토마토맛',
    chapterId: 'quokka',
    schoolName: '숭실대',
    platform: 'MOBILE',
    recruitments: [recruit('CLOSED'), recruit('CLOSED')],
  }),
];

const ids = (projects: Project[]) => projects.map(({ projectId }) => projectId);

describe('filterProjects', () => {
  it('조건이 없으면 전체 프로젝트를 돌려준다', () => {
    expect(ids(filterProjects(PROJECTS, '', INITIAL_PROJECT_FILTERS))).toEqual(['a', 'b']);
  });

  it('프로젝트 이름은 대소문자 · 앞뒤 공백 없이 검색한다', () => {
    expect(ids(filterProjects(PROJECTS, ' umc ', INITIAL_PROJECT_FILTERS))).toEqual(['a']);
  });

  it('지부 · PM 학교로 거른다', () => {
    expect(
      ids(filterProjects(PROJECTS, '', { ...INITIAL_PROJECT_FILTERS, chapter: ['quokka'] })),
    ).toEqual(['b']);
    expect(
      ids(
        filterProjects(PROJECTS, '', { ...INITIAL_PROJECT_FILTERS, school: ['중앙대', '숭실대'] }),
      ),
    ).toEqual(['a', 'b']);
  });

  it('파트는 서비스 플랫폼(Web · Mobile)으로 거른다', () => {
    expect(
      ids(filterProjects(PROJECTS, '', { ...INITIAL_PROJECT_FILTERS, part: ['Mobile'] })),
    ).toEqual(['b']);
  });

  it('모집 중인 파트가 하나라도 있으면 모집 중, 전 파트가 마감이면 모집 완료다', () => {
    expect(
      ids(filterProjects(PROJECTS, '', { ...INITIAL_PROJECT_FILTERS, recruitStatus: ['CLOSED'] })),
    ).toEqual(['b']);
    expect(
      ids(
        filterProjects(PROJECTS, '', { ...INITIAL_PROJECT_FILTERS, recruitStatus: ['RECRUITING'] }),
      ),
    ).toEqual(['a']);
  });

  it('필터끼리는 모두 만족해야 한다', () => {
    expect(
      filterProjects(PROJECTS, 'umc', { ...INITIAL_PROJECT_FILTERS, chapter: ['quokka'] }),
    ).toEqual([]);
  });
});
