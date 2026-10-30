import { useNavigate } from '@tanstack/react-router';
import { ChevronRightIcon } from '@umc-product/icons';
import { Button } from '@umc-product/react';

import documentGraphic from './assets/document.svg';

// 내 지원 현황 빈 상태 (지원한 프로젝트가 없을 때) + 프로젝트 목록으로 이동
const ApplicationListCard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[420px] w-full rounded-xl border border-teal-grey-100 bg-white px-8 py-7">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 pt-24 pb-20">
        <img src={documentGraphic} alt="" width={60} height={74.026} className="block shrink-0" />
        <div className="flex w-full shrink-0 flex-col items-center gap-2 text-center text-teal-grey-400">
          <p className="text-heading-4-semibold">지원한 프로젝트가 없어요</p>
          <p className="text-heading-5-medium">프로젝트 지원 후 확인할 수 있어요.</p>
        </div>
        <Button
          size="sm"
          className="shrink-0"
          trailingIcon={<ChevronRightIcon size={14} />}
          onClick={() => navigate({ to: '/demo-day/team-matching/projects' })}
        >
          프로젝트 목록으로
        </Button>
      </div>
    </div>
  );
};

export default ApplicationListCard;
