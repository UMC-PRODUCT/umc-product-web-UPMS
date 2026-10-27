import { TextInfoButton } from '@umc-product/react';

import { MAX_PM_COUNT } from '../model/limits';
import type { PmCandidate } from '../model/types';
import PmCombobox from './PmCombobox';

type PmSelectFieldProps = {
  candidates: PmCandidate[]; // 고를 수 있는 PM (지부장은 본인 지부 PM만)
  pmIds: string[];
  onPmIdsChange: (pmIds: string[]) => void;
};

// 피그마 PM 선택: 기본은 PM 한 명, 'PM이 두 명인가요?'를 누르면 메인 PM + PM 두 칸으로 바뀜
const PmSelectField = ({ candidates, pmIds, onPmIdsChange }: PmSelectFieldProps) => {
  const hasMultiplePm = pmIds.length > 1;

  const handleChange = (index: number, value: string) =>
    onPmIdsChange(pmIds.map((id, pmIndex) => (pmIndex === index ? value : id)));

  return (
    <div className="flex w-[300px] flex-col gap-2">
      {pmIds.map((pmId, index) => (
        <PmCombobox
          key={index}
          aria-label={hasMultiplePm && index === 0 ? '메인 PM' : 'PM'}
          placeholder={
            hasMultiplePm && index === 0
              ? '메인 PM 닉네임/이름을 선택해요'
              : 'PM 닉네임/이름을 선택해요'
          }
          candidates={candidates}
          value={pmId}
          // 이미 다른 칸에서 고른 PM은 고를 수 없음
          isDisabled={({ id }) => pmIds.some((other, pmIndex) => pmIndex !== index && other === id)}
          onChange={(value) => handleChange(index, value)}
        />
      ))}
      <TextInfoButton
        className="text-label-5-medium underline decoration-solid underline-offset-auto [text-decoration-skip-ink:none] [text-underline-position:from-font]"
        onClick={() =>
          onPmIdsChange(hasMultiplePm ? pmIds.slice(0, 1) : [...pmIds, ''].slice(0, MAX_PM_COUNT))
        }
      >
        {hasMultiplePm ? 'PM이 한 명인가요?' : 'PM이 두 명인가요?'}
      </TextInfoButton>
    </div>
  );
};

export default PmSelectField;
