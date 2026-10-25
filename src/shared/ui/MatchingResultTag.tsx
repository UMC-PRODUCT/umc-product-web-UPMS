import { StatusTag } from '@umc-product/react';

export type MatchingResult = 'PASSED' | 'FAILED';

const RESULT_TAG: Record<MatchingResult, { label: string; color: 'brand' | 'error' }> = {
  PASSED: { label: '합격', color: 'brand' },
  FAILED: { label: '불합격', color: 'error' },
};

type MatchingResultTagProps = {
  result: MatchingResult;
  className?: string;
};

// 피그마 Tag/Status: 매칭 결과(합격 · 불합격)를 점 + 글자로 표시
export const MatchingResultTag = ({ result, className }: MatchingResultTagProps) => {
  const { label, color } = RESULT_TAG[result];

  return (
    <StatusTag color={color} className={className}>
      {label}
    </StatusTag>
  );
};
