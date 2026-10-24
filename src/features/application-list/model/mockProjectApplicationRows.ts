import type { PartRecruitments, ProjectApplicationRow, RecruitStatus } from './types';

// PE는 Web, Mobile 중 하나만 모집
const createRecruitments = (
  design: number,
  pe: { platform: 'WEB' | 'MOBILE'; applied: number; capacity: number },
): PartRecruitments => {
  const designRecruitment = { applied: design, capacity: 2 };
  const peRecruitment = { applied: pe.applied, capacity: pe.capacity };
  return pe.platform === 'WEB'
    ? { DESIGN: designRecruitment, WEB_PE: peRecruitment, MOBILE_PE: null }
    : { DESIGN: designRecruitment, WEB_PE: null, MOBILE_PE: peRecruitment };
};

const createRow = (
  projectId: string,
  projectName: string,
  challengerName: string,
  schoolName: string,
  recruitStatus: RecruitStatus,
  recruitments: PartRecruitments,
): ProjectApplicationRow => ({
  projectId,
  projectName,
  part: 'pm',
  challengerName,
  schoolName,
  recruitStatus,
  recruitments,
});

const web = (applied: number) => ({ platform: 'WEB' as const, applied, capacity: 4 });
const mobile = (applied: number) => ({ platform: 'MOBILE' as const, applied, capacity: 3 });

// TODO: API 연동 시 제거
export const MOCK_PROJECT_APPLICATION_ROWS: ProjectApplicationRow[] = [
  createRow(
    '1',
    '프로젝트 명',
    '닉네임/이름',
    '한국대',
    'RECRUITING',
    createRecruitments(1, web(3)),
  ),
  createRow(
    '2',
    '프로젝트 명',
    '닉네임/이름',
    '한국대',
    'CLOSED',
    createRecruitments(2, mobile(3)),
  ),
  createRow('3', 'UMC_Web', '벨라/황지원', '중앙대', 'RECRUITING', createRecruitments(1, web(0))),
  createRow(
    '4',
    '모아모아',
    '이방토/이예원',
    '한양대 ERICA',
    'RECRUITING',
    createRecruitments(1, mobile(2)),
  ),
  createRow('5', '프로젝트 명', '닉네임/이름', '한국대', 'CLOSED', createRecruitments(2, web(4))),
  createRow(
    '6',
    '타임투고',
    '닉네임/이름',
    '한국대',
    'RECRUITING',
    createRecruitments(0, mobile(1)),
  ),
  createRow('7', '프로덕트', '닉네임/이름', '한국대', 'RECRUITING', createRecruitments(1, web(2))),
  createRow('8', 'Nect', '닉네임/이름', '한국대', 'RECRUITING', createRecruitments(1, mobile(0))),
  createRow('9', '덕트', '닉네임/이름', '한국대', 'RECRUITING', createRecruitments(0, web(1))),
  createRow('10', '타이포', '닉네임/이름', '한국대', 'RECRUITING', createRecruitments(1, web(0))),
  // 2페이지 확인용 (10개씩 페이지 구분)
  createRow('11', '모아', '닉네임/이름', '한국대', 'RECRUITING', createRecruitments(1, mobile(1))),
  createRow('12', '스터디메이트', '닉네임/이름', '한국대', 'CLOSED', createRecruitments(2, web(4))),
  createRow('13', '데모데이', '닉네임/이름', '한국대', 'RECRUITING', createRecruitments(0, web(2))),
  // 지원자 없는 프로젝트 확인용 (펼치면 "지원한 챌린저가 없어요")
  createRow(
    '14',
    '지원자 없는',
    '벨라/황지원',
    '중앙대',
    'RECRUITING',
    createRecruitments(0, web(0)),
  ),
];

// 지원자 없는 프로젝트 확인용 id
export const MOCK_NO_APPLICANT_PROJECT_ID = '14';
