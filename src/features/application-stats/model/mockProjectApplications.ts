import type { ProjectApplications } from './types';

// TODO: 지원 통계 API 연동. 지금은 화면 확인용 mock
export const MOCK_PROJECT_APPLICATIONS: ProjectApplications[] = [
  { projectName: 'UMC', counts: { 1: 12, 2: 4, 3: 0 } },
  { projectName: '유엠씨', counts: { 1: 9, 2: 6, 3: 0 } },
  { projectName: '토마토맛', counts: { 1: 15, 2: 2, 3: 0 } },
  { projectName: '데모데이', counts: { 1: 7, 2: 3, 3: 0 } },
  { projectName: '스터디메이트', counts: { 1: 5, 2: 1, 3: 0 } },
];
