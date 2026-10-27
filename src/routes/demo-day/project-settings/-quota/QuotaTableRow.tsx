import type { RefObject } from 'react';

import type { QuotaTeam } from './mock';
import { type Part, PARTS } from './types';

const calcTotal = (values: Record<Part, number | null>) =>
  PARTS.reduce((sum, p) => sum + (values[p] ?? 0), 0);

type Props = {
  team: QuotaTeam;
  values: Record<Part, number | null>;
  editingCell: { teamId: string; part: Part } | null;
  inputRef: RefObject<HTMLInputElement | null>;
  isMatchingPeriod: boolean;
  canEdit: boolean;
  onCellClick: (teamId: string, part: Part, disabled: boolean) => void;
  onCellChange: (teamId: string, part: Part, value: string) => void;
  onCellBlur: () => void;
};

const QuotaTableRow = ({
  team,
  values,
  editingCell,
  inputRef,
  isMatchingPeriod,
  canEdit,
  onCellClick,
  onCellChange,
  onCellBlur,
}: Props) => {
  const total = calcTotal(values);

  return (
    <tr className="flex">
      <td className="flex h-[60px] w-[170px] shrink-0 items-center justify-center border border-l-0 border-teal-grey-300 bg-fill-neutral-weaker-50">
        <span className="text-[18px] leading-[1.4] font-semibold tracking-[-0.18px] text-teal-grey-700">
          {team.teamName}
        </span>
      </td>

      {PARTS.map((part) => {
        const isNull = values[part] === null;
        const isEditing = editingCell?.teamId === team.teamId && editingCell?.part === part;
        const isDisabled = isNull;

        if (isDisabled) {
          return (
            <td
              key={part}
              className="flex h-[60px] w-[186.75px] shrink-0 items-center justify-center bg-teal-grey-75 text-[18px] leading-[1.4] font-semibold tracking-[-0.36px] text-teal-grey-300"
            >
              <span>0</span>
              <span className="font-medium text-teal-grey-300">명</span>
            </td>
          );
        }

        if (isEditing) {
          return (
            <td
              key={part}
              className="flex h-[60px] w-[186.75px] shrink-0 items-center justify-center border border-teal-500 bg-teal-50"
            >
              <input
                ref={inputRef}
                type="number"
                min={0}
                className="w-full bg-transparent text-center text-[18px] leading-[1.4] font-semibold tracking-[-0.36px] text-teal-500 focus:outline-none"
                value={values[part] ?? 0}
                onChange={(e) => onCellChange(team.teamId, part, e.target.value)}
                onBlur={onCellBlur}
              />
            </td>
          );
        }

        return (
          <td
            key={part}
            className={`flex h-[60px] w-[186.75px] shrink-0 items-center justify-center gap-0.25 border border-teal-grey-300 bg-fill-neutral-default leading-[1.4] ${canEdit && !isMatchingPeriod ? 'cursor-pointer hover:border hover:border-teal-500 hover:bg-teal-50' : 'cursor-default'}`}
            onClick={() => onCellClick(team.teamId, part, isDisabled)}
          >
            <span className="text-heading-4-semibold tracking-[-0.36px] text-teal-600">
              {values[part]}
            </span>
            <span className="text-title-3-medium text-teal-grey-500">명</span>
          </td>
        );
      })}

      <td className="flex h-[60px] flex-1 flex-col items-center justify-center gap-0.5 border border-r-0 border-teal-grey-300 bg-[#F6F7F7]">
        <span className="text-body-3-medium leading-normal text-teal-grey-500">
          {team.university}
        </span>
        <div className="flex items-start gap-0.5 text-[18px] leading-[1.4]">
          <span className="font-semibold tracking-[-0.36px] text-teal-600">{total}</span>
          <span className="font-medium text-teal-grey-500">명</span>
        </div>
      </td>
    </tr>
  );
};

export default QuotaTableRow;
