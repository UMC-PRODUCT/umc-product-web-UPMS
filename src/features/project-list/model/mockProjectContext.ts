import type { ProjectViewer } from './types';

// TODO: 내 지원 · 프로젝트 API 연동. 지금은 Design 챌린저가 아직 아무 곳에도 지원하지 않은 상태
// 지원한 프로젝트가 있으면 appliedProjectId에 project-N을 넣어 확인
export const MOCK_PROJECT_VIEWER: ProjectViewer = {
  challengerPart: 'DESIGN',
  myProjectId: 'project-1',
  appliedProjectId: null,
  isMatched: false,
};
