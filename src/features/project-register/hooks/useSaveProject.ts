import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveProject } from '../lib/saveProject';

// 임시 저장 · 등록. 성공하면 프로젝트 목록 · 내 초안 · 이어 쓰기에 쓰는 상세 · 지원 폼을 다시 불러오도록 함
export const useSaveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
      void queryClient.invalidateQueries({ queryKey: ['project-draft'] });
      void queryClient.invalidateQueries({ queryKey: ['project'] });
      void queryClient.invalidateQueries({ queryKey: ['application-form'] });
    },
  });
};
