import personGraphic from './assets/person.png';

type TotalApplicantsHeaderProps = {
  totalCount: number;
};

// 사람 그래픽 + "총원 N명"
const TotalApplicantsHeader = ({ totalCount }: TotalApplicantsHeaderProps) => (
  <div className="flex items-center gap-2.5 text-teal-600">
    <span
      aria-hidden
      className="size-7 shrink-0 bg-current mask-alpha mask-size-[30px_30px] mask-no-repeat"
      style={{ maskImage: `url(${personGraphic})` }}
    />
    <p className="flex items-center gap-1 whitespace-nowrap">
      <span className="text-title-3-medium font-semibold">총원</span>
      <span className="text-title-2-semibold font-bold">{totalCount}명</span>
    </p>
  </div>
);

export default TotalApplicantsHeader;
