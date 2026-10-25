import { Tag } from '@umc-product/react';

import type { PartRecruitment, RecruitPart, RecruitStatus } from '../../model/types';

const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web PE',
  MOBILE_PE: 'Mobile PE',
};

// 피그마 Tag/Basic Sm: 모집 중은 brand, 모집 완료는 neutral
const RECRUIT_STATUS_TAG: Record<RecruitStatus, { label: string; color: 'brand' | 'neutral' }> = {
  RECRUITING: { label: '모집 중', color: 'brand' },
  CLOSED: { label: '모집 완료', color: 'neutral' },
};

type RecruitmentListProps = {
  recruitments: PartRecruitment[];
  partLabels?: Record<RecruitPart, string>; // 화면마다 PE 표기가 달라 바꿀 수 있게 둠
  className?: string;
};

// 파트별 지원 인원 / 모집 인원 + 모집 상태 (프로젝트 카드, 내 지원서 머리에서 같이 씀)
const RecruitmentList = ({
  recruitments,
  partLabels = PART_LABEL,
  className = '',
}: RecruitmentListProps) => (
  <ul className={`flex flex-col gap-[5px] ${className}`}>
    {recruitments.map(({ part, applied, capacity, status }) => {
      const statusTag = RECRUIT_STATUS_TAG[status];
      return (
        <li key={part} className="flex items-center justify-between">
          <div className="flex w-[117px] items-center justify-between">
            <span className="text-body-3-medium text-teal-grey-800">{partLabels[part]}</span>
            {/* 지원 인원 / 모집 인원 */}
            <span className="flex items-center gap-0.5 text-caption-3-regular text-teal-grey-500">
              <span className="min-w-2 text-center">{applied}</span>
              <span className="w-[5px] text-right">/</span>
              <span className="min-w-2 text-center">{capacity}</span>
            </span>
          </div>
          <Tag variant="weak" color={statusTag.color} size="sm" className="w-[60px]">
            {statusTag.label}
          </Tag>
        </li>
      );
    })}
  </ul>
);

export default RecruitmentList;
