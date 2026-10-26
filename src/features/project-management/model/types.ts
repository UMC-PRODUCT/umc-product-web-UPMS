export type ProjectStatus = 'DRAFT' | 'PENDING' | 'APPROVED';

export type ProjectPlatform = 'WEB' | 'MOBILE';

export type RecruitPart = 'DESIGN' | 'WEB_PE' | 'MOBILE_PE';

export type RecruitStatus = 'RECRUITING' | 'CLOSED';

export type PartRecruitment = {
  part: RecruitPart;
  applied: number;
  capacity: number;
  status: RecruitStatus;
};

export type ManagedProject = {
  projectId: string;
  chapterId: string;
  projectName: string;
  logoUrl: string | null;
  thumbnailUrl: string | null;
  pmName: string;
  schoolName: string;
  status: ProjectStatus;
  platform: ProjectPlatform;
  recruitments: PartRecruitment[];
};
