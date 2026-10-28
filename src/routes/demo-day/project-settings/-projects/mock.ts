import type { ManagedProject } from '@/features/project-management';

// PM 챌린저 본인 프로젝트 (단일 플랫폼, 상태별 3개)
export const MOCK_PM_PROJECTS: ManagedProject[] = [
  {
    projectId: 'pm-1',
    chapterId: 'otter',
    projectName: 'UMC 플랫폼',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '김성연',
    schoolName: '성신여대',
    description:
      'UMC 챌린저들이 편리하게 활동을 관리하고 소통할 수 있는 통합 플랫폼입니다. 일정 관리, 공지 확인, 팀 매칭까지 한 곳에서 이용할 수 있어요.',
    status: 'APPROVED',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'WEB_PE', applied: 1, capacity: 2, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'pm-2',
    chapterId: 'otter',
    projectName: '캠퍼스 일정 관리',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '김성연',
    schoolName: '성신여대',
    description:
      '대학생활의 모든 일정을 한눈에 관리하는 서비스입니다. 수업, 과제, 동아리 활동까지 통합하여 시간을 효율적으로 활용할 수 있도록 도와줍니다.',
    status: 'PENDING',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
      { part: 'WEB_PE', applied: 0, capacity: 3, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'pm-3',
    chapterId: 'otter',
    projectName: '스터디 매칭 서비스',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '김성연',
    schoolName: '성신여대',
    description:
      '같은 목표를 가진 학생들끼리 스터디 그룹을 쉽게 구성할 수 있는 매칭 서비스입니다. 관심사와 학습 스타일을 기반으로 최적의 팀원을 연결해드립니다.',
    status: 'DRAFT',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 0, capacity: 2, status: 'RECRUITING' },
      { part: 'WEB_PE', applied: 0, capacity: 2, status: 'RECRUITING' },
    ],
  },
];

export const MOCK_PROJECTS: ManagedProject[] = [
  // 캥거루 지부
  {
    projectId: 'k-1',
    chapterId: 'kangaroo',
    projectName: '캠퍼스 일정 관리',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '김지훈',
    schoolName: '가천대',
    description:
      '대학생활의 모든 일정을 한눈에 관리하는 서비스입니다. 수업, 과제, 동아리 활동까지 통합하여 시간을 효율적으로 활용할 수 있도록 도와줍니다.',
    status: 'APPROVED',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'WEB_PE', applied: 3, capacity: 3, status: 'CLOSED' },
    ],
  },
  {
    projectId: 'k-2',
    chapterId: 'kangaroo',
    projectName: '스터디 매칭 서비스',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '이수연',
    schoolName: '한성대',
    description:
      '대학생활의 모든 일정을 한눈에 관리하는 서비스입니다. 수업, 과제, 동아리 활동까지 통합하여 시간을 효율적으로 활용할 수 있도록 도와줍니다.',
    status: 'PENDING',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
      { part: 'WEB_PE', applied: 2, capacity: 3, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'k-3',
    chapterId: 'kangaroo',
    projectName: '중고 교재 거래',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '박서현',
    schoolName: '서울여대',
    description:
      '대학생활의 모든 일정을 한눈에 관리하는 서비스입니다. 수업, 과제, 동아리 활동까지 통합하여 시간을 효율적으로 활용할 수 있도록 도와줍니다.',
    status: 'DRAFT',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 0, capacity: 1, status: 'RECRUITING' },
      { part: 'MOBILE_PE', applied: 0, capacity: 2, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'k-4',
    chapterId: 'kangaroo',
    projectName: '학식 리뷰 앱',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '최민재',
    schoolName: '한국항공대',
    description:
      '대학생활의 모든 일정을 한눈에 관리하는 서비스입니다. 수업, 과제, 동아리 활동까지 통합하여 시간을 효율적으로 활용할 수 있도록 도와줍니다.',
    status: 'APPROVED',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'MOBILE_PE', applied: 4, capacity: 4, status: 'CLOSED' },
    ],
  },

  // 아홀로틀 지부
  {
    projectId: 'a-1',
    chapterId: 'axolotl',
    projectName: '대학 커뮤니티 플랫폼',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '정유진',
    schoolName: '세종대',
    description:
      '같은 대학 학생들이 자유롭게 소통하고 정보를 공유할 수 있는 커뮤니티 플랫폼입니다. 익명 게시판, 학과 채널, 이벤트 알림 기능을 제공합니다.',
    status: 'APPROVED',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'WEB_PE', applied: 3, capacity: 3, status: 'CLOSED' },
    ],
  },
  {
    projectId: 'a-2',
    chapterId: 'axolotl',
    projectName: '동아리 모집 서비스',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '한도윤',
    schoolName: '홍익대 서울',
    description:
      '대학 내 다양한 동아리를 한눈에 검색하고 지원할 수 있는 서비스입니다. 동아리 활동 후기와 모집 공고를 통해 나에게 맞는 동아리를 찾아보세요.',
    status: 'DRAFT',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 0, capacity: 2, status: 'RECRUITING' },
      { part: 'WEB_PE', applied: 0, capacity: 2, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'a-3',
    chapterId: 'axolotl',
    projectName: '과제 도우미 앱',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '윤채원',
    schoolName: '덕성여대',
    description:
      '과제 관리부터 참고자료 정리까지 학업을 도와주는 올인원 앱입니다. AI 기반 과제 추천과 팀 과제 협업 기능으로 학습 효율을 높여드립니다.',
    status: 'PENDING',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
      { part: 'MOBILE_PE', applied: 2, capacity: 4, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'a-4',
    chapterId: 'axolotl',
    projectName: '친구 찾기 플랫폼',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '강민호',
    schoolName: '가톨릭대',
    description:
      '관심사와 학교 생활을 기반으로 새로운 친구를 만날 수 있는 소셜 플랫폼입니다. 취미 매칭, 같이 밥 먹기, 스터디 파트너 등 다양한 만남을 지원합니다.',
    status: 'APPROVED',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'MOBILE_PE', applied: 3, capacity: 3, status: 'CLOSED' },
    ],
  },

  // 티라노 지부
  {
    projectId: 't-1',
    chapterId: 'tyranno',
    projectName: '졸업 작품 갤러리',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '오지민',
    schoolName: '동국대',
    description:
      '대학생들의 졸업 작품을 온라인으로 전시하고 공유하는 갤러리 플랫폼입니다. 작품 업로드, 댓글, 평가 기능을 통해 창작물에 대한 피드백을 받을 수 있어요.',
    status: 'PENDING',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
      { part: 'WEB_PE', applied: 1, capacity: 3, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 't-2',
    chapterId: 'tyranno',
    projectName: '강의 후기 플랫폼',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '임서윤',
    schoolName: '서경대',
    description:
      '수강 신청 전 선배들의 강의 후기를 확인하고 나만의 수강 계획을 세울 수 있는 플랫폼입니다. 교수별, 학과별 필터로 원하는 정보를 빠르게 찾아보세요.',
    status: 'APPROVED',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'WEB_PE', applied: 2, capacity: 2, status: 'CLOSED' },
    ],
  },
  {
    projectId: 't-3',
    chapterId: 'tyranno',
    projectName: '헬스 루틴 트래커',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '신예준',
    schoolName: '단국대',
    description:
      '개인 운동 목표를 설정하고 매일 루틴을 기록하는 헬스 트래커 앱입니다. 운동 통계와 성취 배지를 통해 꾸준한 운동 습관을 만들어갈 수 있어요.',
    status: 'APPROVED',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'MOBILE_PE', applied: 4, capacity: 4, status: 'CLOSED' },
    ],
  },
  {
    projectId: 't-4',
    chapterId: 'tyranno',
    projectName: '독서 기록 앱',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '배나연',
    schoolName: '동덕여대',
    description:
      '읽은 책을 기록하고 독후감을 작성하며 독서 습관을 키우는 앱입니다. 책 추천 알고리즘과 독서 모임 연결 기능으로 더 풍부한 독서 경험을 제공합니다.',
    status: 'DRAFT',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 0, capacity: 1, status: 'RECRUITING' },
      { part: 'MOBILE_PE', applied: 0, capacity: 3, status: 'RECRUITING' },
    ],
  },

  // 쿼카 지부
  {
    projectId: 'q-1',
    chapterId: 'quokka',
    projectName: '팀 프로젝트 관리 툴',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '조하은',
    schoolName: '이화여대',
    description:
      '팀 프로젝트의 역할 분배, 일정 관리, 진행 상황 공유를 한곳에서 할 수 있는 협업 툴입니다. 칸반 보드와 타임라인 뷰로 프로젝트 현황을 직관적으로 파악하세요.',
    status: 'DRAFT',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 0, capacity: 2, status: 'RECRUITING' },
      { part: 'WEB_PE', applied: 0, capacity: 3, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'q-2',
    chapterId: 'quokka',
    projectName: '취업 정보 공유 플랫폼',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '문지호',
    schoolName: '숭실대',
    description:
      '취업 준비생들이 서류 후기, 면접 경험, 기업 정보를 공유하는 플랫폼입니다. 선배들의 합격 스펙과 취업 후기를 통해 더 효과적인 취업 준비를 할 수 있어요.',
    status: 'APPROVED',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'WEB_PE', applied: 3, capacity: 3, status: 'CLOSED' },
    ],
  },
  {
    projectId: 'q-3',
    chapterId: 'quokka',
    projectName: '운동 메이트 앱',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '류지아',
    schoolName: '인하대',
    description:
      '함께 운동할 파트너를 쉽게 찾아주는 소셜 앱입니다. 위치 기반 매칭과 운동 종목별 그룹 기능으로 꾸준한 운동을 즐겁게 이어갈 수 있어요.',
    status: 'PENDING',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
      { part: 'MOBILE_PE', applied: 2, capacity: 3, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'q-4',
    chapterId: 'quokka',
    projectName: '교내 분실물 찾기',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '서태양',
    schoolName: '한양대 ERICA',
    description:
      '캠퍼스에서 잃어버린 물건을 빠르게 찾을 수 있도록 도와주는 앱입니다. 분실물 등록, 알림 설정, 위치 정보 공유 기능으로 더 쉽게 분실물을 찾아보세요.',
    status: 'DRAFT',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 0, capacity: 1, status: 'RECRUITING' },
      { part: 'MOBILE_PE', applied: 0, capacity: 2, status: 'RECRUITING' },
    ],
  },

  // 수달 지부
  {
    projectId: 'o-1',
    chapterId: 'otter',
    projectName: 'UMC 플랫폼',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '김성연',
    schoolName: '성신여대',
    description:
      'UMC 챌린저들이 편리하게 활동을 관리하고 소통할 수 있는 통합 플랫폼입니다. 일정 관리, 공지 확인, 팀 매칭까지 한 곳에서 이용할 수 있어요.',
    status: 'APPROVED',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'WEB_PE', applied: 3, capacity: 3, status: 'CLOSED' },
    ],
  },
  {
    projectId: 'o-2',
    chapterId: 'otter',
    projectName: '멘토링 매칭 서비스',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '이다영',
    schoolName: '숙명여대',
    description:
      '분야별 전문가와 학생을 연결하는 멘토링 매칭 서비스입니다. 커리어 고민부터 프로젝트 피드백까지 원하는 멘토를 직접 선택하고 일정을 조율할 수 있어요.',
    status: 'PENDING',
    platform: 'WEB',
    recruitments: [
      { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
      { part: 'WEB_PE', applied: 1, capacity: 3, status: 'RECRUITING' },
    ],
  },
  {
    projectId: 'o-3',
    chapterId: 'otter',
    projectName: '캠퍼스 중고거래',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '박민준',
    schoolName: '중앙대',
    description:
      '같은 학교 학생들끼리 중고 물품을 안전하게 거래하는 플랫폼입니다. 교재, 전공 도구, 생활용품 등 캠퍼스 특화 카테고리와 직거래 안전 시스템을 제공합니다.',
    status: 'APPROVED',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 2, capacity: 2, status: 'CLOSED' },
      { part: 'MOBILE_PE', applied: 3, capacity: 3, status: 'CLOSED' },
    ],
  },
  {
    projectId: 'o-4',
    chapterId: 'otter',
    projectName: '외국어 스터디 앱',
    logoUrl: null,
    thumbnailUrl: null,
    pmName: '장소희',
    schoolName: '한국외대',
    description:
      '원어민과 언어 교환 파트너를 연결하는 외국어 학습 앱입니다. 화상 통화, 텍스트 채팅, 발음 교정 기능으로 실전 외국어 실력을 키울 수 있어요.',
    status: 'PENDING',
    platform: 'MOBILE',
    recruitments: [
      { part: 'DESIGN', applied: 1, capacity: 2, status: 'RECRUITING' },
      { part: 'MOBILE_PE', applied: 2, capacity: 4, status: 'RECRUITING' },
    ],
  },
];
