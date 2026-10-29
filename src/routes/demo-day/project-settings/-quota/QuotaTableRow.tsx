import type { RefObject } from 'react';

import type { Column, ProjectRow } from './api/getPartQuotas';
import type { DraftValues } from './types';

type Props = {
  project: ProjectRow;
  values: DraftValues[string];
  columns: Column[];
  editingCell: { projectId: string; part: string } | null;
  inputRef: RefObject<HTMLInputElement | null>;
  canEdit: boolean;
  onCellClick: (projectId: string, part: string, disabled: boolean) => void;
  onCellChange: (projectId: string, part: string, value: string) => void;
  onCellBlur: () => void;
};

const QuotaTableRow = ({
  project,
  values,
  columns,
  editingCell,
  inputRef,
  canEdit,
  onCellClick,
  onCellChange,
  onCellBlur,
}: Props) => {
  const projectId = String(project.projectId!);
  const total = columns.reduce((sum, col) => sum + (values?.[col.part!] ?? 0), 0);

  return (
    <tr className="flex">
      <td className="flex h-[60px] w-[170px] shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-l-0 border-teal-grey-300 bg-fill-neutral-weaker-50 px-3">
        <span
          className="truncate text-[18px] leading-[1.4] font-semibold tracking-[-0.18px] text-teal-grey-700"
          title={project.projectName ?? ''}
        >
          {project.projectName}
        </span>
      </td>

      {columns.map((col) => {
        const part = col.part!;
        const isDisabled = values?.[part] === undefined;
        const isLocked = col.canEdit?.allowed === false;
        const isEditing = editingCell?.projectId === projectId && editingCell?.part === part;

        if (isDisabled) {
          return (
            <td
              key={part}
              className="flex h-[60px] w-[186.75px] shrink-0 cursor-pointer items-center justify-center bg-teal-grey-75 text-[18px] leading-[1.4] font-semibold tracking-[-0.36px] text-teal-grey-300"
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
                value={values[part] === 0 ? '' : values[part]}
                onChange={(e) => onCellChange(projectId, part, e.target.value)}
                onKeyDown={(e) => {
                  if (
                    !/^\d$/.test(e.key) &&
                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                onBlur={onCellBlur}
              />
            </td>
          );
        }

        return (
          <td
            key={part}
            className={`flex h-[60px] w-[186.75px] shrink-0 items-center justify-center gap-0.25 border border-teal-grey-300 bg-fill-neutral-default leading-[1.4] ${canEdit && !isLocked ? 'hover:border hover:border-teal-500 hover:bg-teal-50' : ''}`}
            onClick={() => onCellClick(projectId, part, isDisabled)}
          >
            <span className="text-heading-4-semibold tracking-[-0.36px] text-teal-600">
              {values[part]}
            </span>
            <span className="text-title-3-medium text-teal-grey-500">명</span>
          </td>
        );
      })}

      <td className="flex h-[60px] min-w-[150px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 border border-r-0 border-teal-grey-300 bg-[#F6F7F7]">
        <span className="text-body-3-medium leading-normal text-teal-grey-500">팀 배정 인원</span>
        <div className="flex items-start gap-0.5 text-[18px] leading-[1.4]">
          <span className="font-semibold tracking-[-0.36px] text-teal-600">{total}</span>
          <span className="font-medium text-teal-grey-500">명</span>
        </div>
      </td>
    </tr>
  );
};

export default QuotaTableRow;
