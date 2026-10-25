import { CheckIcon } from '@umc-product/icons';
import { PartTag, type PartTagPart } from '@umc-product/react';

import type { MatchingPart, UnassignedChallenger } from '../../model/types';

const PART_TAG: Record<MatchingPart, PartTagPart> = {
  DESIGN: 'design',
  WEB_PE: 'web-pe',
  MOBILE_PE: 'mobile-pe',
};

// 머리와 줄이 같은 열 너비를 쓰도록 (피그마: 닉네임/이름 180 · 학교 150 · 파트 136)
const COLUMNS_CLASS = 'grid grid-cols-[180px_150px_136px] items-center gap-3.5';

type UnassignedChallengerSheetProps = {
  challengers: UnassignedChallenger[];
  selectedId: string | null;
  onSelect: (challengerId: string) => void;
};

// 피그마 팀원 수동 배정 표: 아직 배정되지 않은 챌린저 중 한 명을 고름 (고른 줄은 체크 + teal 강조)
const UnassignedChallengerSheet = ({
  challengers,
  selectedId,
  onSelect,
}: UnassignedChallengerSheetProps) => (
  <div className="flex min-h-0 flex-col">
    <div
      className={`${COLUMNS_CLASS} rounded-t-xl bg-teal-grey-75 py-2 pl-8 text-caption-2-regular text-teal-grey-500`}
    >
      <p>닉네임/이름</p>
      <p className="text-center">학교</p>
      <p className="text-center">파트</p>
    </div>
    <ul
      role="radiogroup"
      aria-label="배정할 챌린저"
      className="flex min-h-0 flex-col overflow-y-auto"
    >
      {challengers.map(({ challengerId, challengerName, schoolName, part }) => {
        const selected = challengerId === selectedId;

        return (
          <li key={challengerId}>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(challengerId)}
              className={`relative ${COLUMNS_CLASS} h-[42px] w-full border-b border-teal-grey-100 pl-8 text-left text-body-2-medium ${
                selected ? 'bg-teal-50 text-teal-600' : 'bg-teal-grey-50 text-teal-grey-800'
              }`}
            >
              {/* 고른 줄은 이름 앞 여백에 체크 */}
              {selected && (
                <CheckIcon size={16} className="absolute top-1/2 left-3 -translate-y-1/2" />
              )}
              <span className="truncate">{challengerName}</span>
              <span className="truncate text-center">{schoolName}</span>
              <span className="flex justify-center">
                <PartTag part={PART_TAG[part]} size="md" />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

export default UnassignedChallengerSheet;
