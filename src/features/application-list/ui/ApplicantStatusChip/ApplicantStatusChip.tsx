import { StatusTag } from '@umc-product/react';
import { DropdownMenu } from 'radix-ui';

import { APPLICANT_STATUS_TAG, APPLICANT_STATUSES } from '../../model/applicantStatus';
import type { ApplicantStatus } from '../../model/types';

const CHIP_BASE_CLASS = 'inline-flex h-[26px] items-center rounded-[20px] pr-3 pl-2';
// 피그마 State Chip: Default(흰 배경 + 테두리 + 그림자) / Disabled(회색 배경)
const CHIP_CLASS = `${CHIP_BASE_CLASS} border border-teal-grey-100 bg-white shadow-drop-neutral-2`;
const DISABLED_CHIP_CLASS = `${CHIP_BASE_CLASS} bg-teal-grey-75`;

const Chip = ({ status }: { status: ApplicantStatus }) => {
  const { label, color } = APPLICANT_STATUS_TAG[status];
  // 피그마 칩 안의 Tag/Status: 점 10px, 간격 4px
  return (
    <StatusTag color={color} className="gap-1 [&>.umc-status-tag\_\_dot]:size-2.5">
      {label}
    </StatusTag>
  );
};

type ApplicantStatusChipProps = {
  status: ApplicantStatus;
  onStatusChange?: (status: ApplicantStatus) => void; // 없으면 누를 수 없는 칩
};

// 피그마 합/불/대기 State Chip: 누르면 배정 상태 변경 메뉴가 열림
// 디자인 시스템 Menu는 radix 모달 바깥 레이어에 떠서 클릭이 막히므로 radix DropdownMenu로 띄움
const ApplicantStatusChip = ({ status, onStatusChange }: ApplicantStatusChipProps) => {
  if (!onStatusChange) {
    return (
      <span className={DISABLED_CHIP_CLASS}>
        <Chip status={status} />
      </span>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={`배정 상태 변경, 현재 ${APPLICANT_STATUS_TAG[status].label}`}
        className={`${CHIP_CLASS} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-300`}
      >
        <Chip status={status} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-(--umc-z-dropdown) flex flex-col gap-2.5 rounded-md bg-white px-3 pt-2.5 pb-3 shadow-drop-neutral-1"
        >
          <DropdownMenu.Label className="px-0.5 text-caption-1-regular text-teal-grey-500">
            배정 상태 변경
          </DropdownMenu.Label>
          {APPLICANT_STATUSES.map((option) => (
            <DropdownMenu.Item
              key={option}
              onSelect={() => onStatusChange(option)}
              className={`${CHIP_CLASS} w-fit cursor-pointer outline-none data-highlighted:bg-teal-grey-75`}
            >
              <Chip status={option} />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ApplicantStatusChip;
