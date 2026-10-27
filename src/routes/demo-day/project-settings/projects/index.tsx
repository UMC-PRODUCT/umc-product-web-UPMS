import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@umc-product/react';

import { useProjectRegisterAccess } from '@/entities/session';

const ProjectManagePage = () => {
  const navigate = Route.useNavigate();
  // 중앙운영(HQ_ADMIN)은 조회만 가능해 등록 버튼이 보이지 않는다
  const canRegister = useProjectRegisterAccess() !== 'NONE';

  return (
    <div className="flex items-center justify-between p-8">
      <h1 className="text-3xl font-bold">프로젝트 관리</h1>
      {/* TODO: 프로젝트 관리 목록 화면 구현 시 피그마 위치로 이동 */}
      {canRegister && (
        <Button onClick={() => navigate({ to: '/demo-day/project-settings/projects/new' })}>
          프로젝트 등록
        </Button>
      )}
    </div>
  );
};

export const Route = createFileRoute('/demo-day/project-settings/projects/')({
  component: ProjectManagePage,
});
