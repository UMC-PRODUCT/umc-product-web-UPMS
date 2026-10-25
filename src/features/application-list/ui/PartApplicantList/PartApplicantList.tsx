import { PartTag, type PartTagPart } from '@umc-product/react';

import { isMatchingRoundOpen } from '../../model/matchingRound';
import type { Applicant, ApplicantStatus, PartRecruitment, RecruitPart } from '../../model/types';
import ApplicantDetailRow from './ApplicantDetailRow';

const PART_TAG: Record<RecruitPart, PartTagPart> = {
  DESIGN: 'design',
  WEB_PE: 'web-pe',
  MOBILE_PE: 'mobile-pe',
};

const ROUNDS = [1, 2, 3] as const;

type PartApplicantListProps = {
  part: RecruitPart;
  recruitment: PartRecruitment;
  applicants: Applicant[]; // 이 파트 전체 지원자 (차수별 인원 계산용)
  visibleApplicants: Applicant[]; // 필터를 적용한 지원자
  // 없으면 배정 상태를 바꿀 수 없음 (조회만 가능한 역할). 매칭이 끝난 차수의 지원자도 바꿀 수 없음
  onStatusChange?: (applicantId: string, status: ApplicantStatus) => void;
  onApplicantClick?: (applicant: Applicant) => void;
};

// 피그마 프로젝트 상세 모달: 파트 태그 + 지원/모집 인원 + 차수별 지원자 수 + 지원한 챌린저 목록
const PartApplicantList = ({
  part,
  recruitment,
  applicants,
  visibleApplicants,
  onStatusChange,
  onApplicantClick,
}: PartApplicantListProps) => (
  <section className="flex w-full flex-col gap-2">
    <div className="flex w-full items-center justify-between pr-0.5 pl-2.5">
      <div className="flex items-center gap-[9px]">
        {/* 피그마: Md 높이(26px)에 Label/6 글자(12px) */}
        <PartTag
          part={PART_TAG[part]}
          size="md"
          className="[--umc-part-tag-font-size:var(--umc-typography-label-6-medium-font-size)]"
        />
        <p className="text-body-2-regular text-teal-grey-400">
          {recruitment.applied}/{recruitment.capacity}
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-teal-grey-75 px-2.5 py-1 text-caption-2-regular whitespace-nowrap">
        {ROUNDS.map((round) => (
          <p key={round} className="flex items-center gap-1">
            <span className="text-teal-grey-800">{round}차</span>
            <span className="font-medium text-teal-600">
              {applicants.filter((applicant) => applicant.round === round).length}명
            </span>
          </p>
        ))}
      </div>
    </div>
    {visibleApplicants.length === 0 ? (
      <p className="flex h-[60px] items-center justify-center text-label-5-medium text-teal-grey-500">
        {applicants.length === 0 ? '아직 지원한 챌린저가 없어요.' : '조건에 맞는 챌린저가 없어요.'}
      </p>
    ) : (
      <ul className="flex w-full flex-col">
        {visibleApplicants.map((applicant) => (
          <ApplicantDetailRow
            key={applicant.applicantId}
            applicant={applicant}
            onStatusChange={
              onStatusChange && isMatchingRoundOpen(applicant.round)
                ? (status) => onStatusChange(applicant.applicantId, status)
                : undefined
            }
            onApplicantClick={onApplicantClick && (() => onApplicantClick(applicant))}
          />
        ))}
      </ul>
    )}
  </section>
);

export default PartApplicantList;
