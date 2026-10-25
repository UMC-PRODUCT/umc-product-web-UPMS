type CompletionSummaryProps = {
  label: string; // 예: 지원 → "지원 완료 / 지원 전", 매칭 → "매칭 완료 / 매칭 전"
  doneCount: number;
  remainingCount: number;
};

// Progress Summary Card 연결선 끝의 완료 / 전 인원 표
const CompletionSummary = ({ label, doneCount, remainingCount }: CompletionSummaryProps) => {
  const rows = [
    { key: 'done', text: `${label} 완료`, count: doneCount, countClassName: 'text-teal-700' },
    {
      key: 'remaining',
      text: `${label} 전`,
      count: remainingCount,
      countClassName: 'text-red-500',
    },
  ];

  return (
    <dl className="flex w-full flex-col gap-1.5">
      {rows.map(({ key, text, count, countClassName }) => (
        <div key={key} className="flex items-center justify-between whitespace-nowrap">
          <dt className="text-label-1-semibold text-teal-grey-800">{text}</dt>
          <dd className={`flex items-center gap-px ${countClassName}`}>
            <span className="text-label-1-semibold">{count}</span>
            <span className="text-label-1-medium">명</span>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default CompletionSummary;
