import { MOCK_CHAPTERS } from '@/entities/chapter';

import mockProjectLogo from './assets/mock-project-logo.png';
import mockProjectThumbnail from './assets/mock-project-thumbnail.png';
import type { PartRecruitment, Project, RecruitStatus, TeamMember } from './types';

const DESCRIPTION =
  '프로젝트 한 줄 소개가 여기에 표시됩니다. 프로젝트 한 줄 소개가 표시됩니다. 두 줄 이상의 내용은 ... 처리됩니다.';

const member = (memberId: string, round: TeamMember['round']): TeamMember => ({
  memberId,
  challengerName: '방토방울방울/이예원',
  schoolName: '한국대',
  round,
});

const recruitment = (
  part: PartRecruitment['part'],
  applied: number,
  capacity: number,
  status: RecruitStatus,
  members: TeamMember[] = [],
): PartRecruitment => ({ part, applied, capacity, status, members });

// 지부 · 학교 · 플랫폼 · 모집 상태가 골고루 섞이도록 순서대로 돌려 씀
const SCHOOLS = MOCK_CHAPTERS.flatMap(({ id, schools }) =>
  schools.map((schoolName) => ({ chapterId: id, schoolName })),
);

// TODO: 프로젝트 목록 API 연동. 지금은 화면 확인용 mock (프로젝트 API 없음)
// 0번은 모집 완료 + 모집 중 / 1번은 전 파트 모집 마감 / 2번은 매칭된 팀원이 있는 프로젝트
export const MOCK_PROJECTS: Project[] = Array.from({ length: 30 }, (_, index) => {
  const { chapterId, schoolName } = SCHOOLS[index % SCHOOLS.length];
  const platform = index % 2 === 0 ? 'MOBILE' : 'WEB';
  const pePart = platform === 'MOBILE' ? 'MOBILE_PE' : 'WEB_PE';
  const isClosed = index % 5 === 1;

  const recruitments = isClosed
    ? [recruitment('DESIGN', 1, 1, 'CLOSED'), recruitment(pePart, 4, 4, 'CLOSED')]
    : [recruitment('DESIGN', 1, 1, 'CLOSED'), recruitment(pePart, 0, 4, 'RECRUITING')];

  return {
    projectId: `project-${index + 1}`,
    projectName: index === 0 ? 'UMC Web' : `프로젝트 이름 ${index + 1}`,
    logoUrl: index % 3 === 0 ? mockProjectLogo : null,
    thumbnailUrl: index < 6 || index % 4 === 0 ? mockProjectThumbnail : null,
    pmName: '닉네임/이름',
    schoolName,
    chapterId,
    description: DESCRIPTION,
    platform,
    planUrl: 'https://www.figma.com',
    recruitments:
      index === 2
        ? [
            recruitment('DESIGN', 2, 2, 'CLOSED', [member('m1', 'RANDOM'), member('m2', 'RANDOM')]),
            recruitment(pePart, 4, 4, 'CLOSED', [
              member('m3', 1),
              member('m4', 1),
              member('m5', 2),
              member('m6', 'RANDOM'),
            ]),
          ]
        : recruitments,
  };
});
