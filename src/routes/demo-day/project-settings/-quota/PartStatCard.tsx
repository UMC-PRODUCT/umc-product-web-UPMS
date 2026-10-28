import { PersonIcon } from '@umc-product/icons';

type PartStatCardProps = {
  title: string;
  count: number;
};

const GRADIENT_BORDER_STYLE = {
  background:
    'linear-gradient(#fbfcfc, #fbfcfc) padding-box, linear-gradient(135deg, #DDF4F1 0%, #7AC7C1 45.3%, #E2E4E3 100%) border-box',
  border: '1px solid transparent',
} as const;

const PartStatCard = ({ title, count }: PartStatCardProps) => (
  <div
    className="flex min-w-50 flex-1 flex-col gap-4 overflow-hidden rounded-[10px] px-8 pt-4 pb-5 shadow-drop-neutral-3"
    style={GRADIENT_BORDER_STYLE}
  >
    <span className="text-[16px] leading-[1.4] font-semibold text-teal-800">{title}</span>
    <div className="flex items-center gap-[11.76px] pr-2.5">
      <PersonIcon weight="fill" size={30} className="shrink-0 text-teal-600" />
      <div className="flex items-center gap-1.5 text-[24px] leading-[1.35] font-semibold tracking-[-0.24px] text-teal-600">
        <span>{count}</span>
        <span>명</span>
      </div>
    </div>
  </div>
);

export default PartStatCard;
