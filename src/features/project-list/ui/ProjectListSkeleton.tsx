import { Skeleton } from '@umc-product/react';

import { PROJECT_LIST_GRID_CLASS } from './projectListGrid';

// 피그마 로딩 상태: 썸네일 + 제목 · 소개 · 파트 줄 모양의 회색 막대
const SkeletonCard = () => (
  <div
    aria-hidden
    className="flex flex-col overflow-hidden rounded-xl bg-white shadow-drop-neutral-2"
  >
    <Skeleton width="100%" height="auto" className="aspect-[2/1] rounded-none" />
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-2.5">
        <Skeleton width="40%" height={18} />
        <div className="flex flex-col gap-1.5">
          <Skeleton width="100%" height={14} />
          <Skeleton width="100%" height={14} />
        </div>
        <Skeleton width="55%" height={13} />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton width="100%" height={22} />
        <Skeleton width="100%" height={22} />
      </div>
    </div>
  </div>
);

const ProjectListSkeleton = ({ count }: { count: number }) => (
  <div role="status" aria-label="프로젝트 목록을 불러오는 중" className={PROJECT_LIST_GRID_CLASS}>
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export default ProjectListSkeleton;
