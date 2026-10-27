import { type Part, PARTS } from './types';

type Props = {
  partTotal: (part: Part) => number;
  partQuota: (part: Part) => number;
};

const QuotaTableFooter = ({ partTotal, partQuota }: Props) => {
  const totalDiff = PARTS.reduce((sum, p) => sum + partTotal(p) - partQuota(p), 0);

  return (
    <table className="w-full border-collapse">
      <tfoot>
        <tr className="flex">
          <td className="flex w-[170px] shrink-0 items-center justify-center border-r border-teal-grey-300 bg-teal-50 py-4">
            <span className="text-[18px] leading-[1.4] font-semibold tracking-[-0.18px] text-teal-grey-900">
              지부 총 인원
            </span>
          </td>
          {PARTS.map((part) => (
            <td
              key={part}
              className="flex w-[186.75px] shrink-0 items-center justify-center gap-0.25 border-x border-teal-grey-300 bg-teal-50 py-4"
            >
              <span className="text-[18px] leading-[1.4] font-semibold tracking-[-0.36px] text-teal-600">
                {partTotal(part)}
              </span>
              <span className="text-title-3-medium text-teal-grey-500">명</span>
            </td>
          ))}
          <td className="flex flex-1 items-center justify-center border-l border-teal-grey-300 bg-teal-100 py-4">
            <div className="flex items-start gap-0.5 text-[18px] leading-[1.4]">
              <span className="font-semibold tracking-[-0.36px] text-teal-600">
                총 {PARTS.reduce((sum, p) => sum + partTotal(p), 0)}
              </span>
              <span className="font-medium text-teal-grey-500">명</span>
            </div>
          </td>
        </tr>
        <tr className="flex">
          <td className="flex w-[170px] shrink-0 items-center justify-center border-r border-teal-grey-300 bg-teal-grey-75 py-4">
            <span className="text-[18px] leading-[1.4] font-semibold tracking-[-0.18px] text-teal-grey-700">
              배정 현황
            </span>
          </td>
          {PARTS.map((part) => {
            const diff = partTotal(part) - partQuota(part);
            return (
              <td
                key={part}
                className={`flex w-[186.75px] shrink-0 items-center justify-center border-x border-teal-grey-300 py-4 ${diff !== 0 ? 'bg-fill-error-weak-50' : 'bg-teal-grey-75'}`}
              >
                {diff === 0 ? (
                  <span className="text-[18px] leading-[1.4] font-medium text-teal-grey-500">
                    적정
                  </span>
                ) : diff > 0 ? (
                  <span className="text-[20px] leading-[1.4] font-medium text-red-300">
                    <span className="text-[20px] font-semibold text-error">+{diff}</span>명
                  </span>
                ) : (
                  <span className="text-[20px] leading-[1.4] font-medium text-red-300">
                    <span className="text-[20px] font-semibold text-error">-{Math.abs(diff)}</span>
                    명
                  </span>
                )}
              </td>
            );
          })}
          <td
            className={`relative flex flex-1 items-center justify-center overflow-hidden border-l border-teal-grey-300 ${totalDiff !== 0 ? 'bg-fill-error-weak-50' : 'bg-teal-grey-75'}`}
          >
            {totalDiff === 0 ? (
              <svg
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 140 57"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="0.19" y1="-0.46" x2="140.19" y2="56.54" stroke="#CCCCCC" />
              </svg>
            ) : totalDiff > 0 ? (
              <span className="text-title-3-medium leading-[1.4] text-red-500">
                총<span className="text-[20px] font-semibold">{totalDiff}</span>명 초과
              </span>
            ) : (
              <span className="text-title-3-medium leading-[1.4] text-red-500">
                총<span className="text-[20px] font-semibold">{Math.abs(totalDiff)}</span>명 미달
              </span>
            )}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default QuotaTableFooter;
