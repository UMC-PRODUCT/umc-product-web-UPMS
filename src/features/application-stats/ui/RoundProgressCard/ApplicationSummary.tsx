type ApplicationSummaryProps = {
  appliedCount: number;
  notAppliedCount: number;
};

// 지원 완료 / 지원 전 인원 표
const ApplicationSummary = ({ appliedCount, notAppliedCount }: ApplicationSummaryProps) => {
  const rows = [
    { label: '지원 완료', count: appliedCount, countClassName: 'text-teal-700' },
    { label: '지원 전', count: notAppliedCount, countClassName: 'text-red-500' },
  ];

  return (
    <dl className="flex w-[115px] flex-col gap-0.5">
      {rows.map(({ label, count, countClassName }) => (
        <div key={label} className="flex items-center justify-between">
          <dt className="w-[60px] text-body-2-semibold text-teal-grey-800">{label}</dt>
          <dd className={`flex items-center gap-px whitespace-nowrap ${countClassName}`}>
            <span className="text-body-1-semibold">{count}</span>
            <span className="text-body-1-medium">명</span>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default ApplicationSummary;
