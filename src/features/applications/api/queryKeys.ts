// 내 지원 현황 쿼리 키. 지원 취소 후 목록 · 지원서를 한 번에 다시 불러올 수 있게 'applications' 아래로 묶음
// null은 아직 대상이 없어 부르지 않는 쿼리 (skipToken)
export const applicationKeys = {
  all: ['applications'] as const,
  mine: (gisuId: number | null) => [...applicationKeys.all, 'me', gisuId] as const,
  detail: (projectId: number | null, applicationId: number | null) =>
    [...applicationKeys.all, 'detail', projectId, applicationId] as const,
};

export const projectKeys = {
  detail: (projectId: number | null) => ['projects', 'detail', projectId] as const,
};
