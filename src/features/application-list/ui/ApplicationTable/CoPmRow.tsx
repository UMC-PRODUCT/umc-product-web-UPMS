import { PartTag } from '@umc-product/react';

import type { ProjectCoPm } from '../../model/types';
import { COLUMN_CLASS } from './columns';

// 더블 PM일 때 프로젝트 줄 아래에 붙는 두 번째 PM 줄 (PM 태그 + 챌린저만 표시)
const CoPmRow = ({ challengerName, schoolName }: ProjectCoPm) => (
  <li className="flex h-[68px] w-full items-center border-b border-teal-grey-100/50 bg-white pr-[22px] pl-2.5">
    <div aria-hidden className={COLUMN_CLASS.project} />
    <div className={`px-2.5 ${COLUMN_CLASS.part}`}>
      <PartTag part="pm" size="md" />
    </div>
    <div className={`flex flex-col gap-1 px-4 whitespace-nowrap ${COLUMN_CLASS.challenger}`}>
      <p className="text-body-3-medium text-teal-grey-800">{challengerName}</p>
      <p className="text-caption-1-regular text-teal-grey-500">{schoolName}</p>
    </div>
  </li>
);

export default CoPmRow;
