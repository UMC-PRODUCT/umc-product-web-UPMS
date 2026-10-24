import type { MatchingRound } from '../../model/types';

// 피그마 도넛 조각 색: 기본색 위에 그라데이션을 겹침 (디자인 토큰에 같은 색이 없어 피그마 값 사용)
export const ROUND_SEGMENT_FILL: Record<
  MatchingRound,
  { base: string; gradientOpacity: number; gradientFromBottom: boolean }
> = {
  1: { base: '#81D3C9', gradientOpacity: 0.3, gradientFromBottom: true },
  2: { base: '#E5F5F2', gradientOpacity: 0.3, gradientFromBottom: false },
  3: { base: '#FBFCFC', gradientOpacity: 0.2, gradientFromBottom: false },
};

// 차수 목록 앞 점 색
export const ROUND_DOT_CLASS: Record<MatchingRound, string> = {
  1: 'bg-[#7AD9CD]',
  2: 'bg-[#C1F3ED]',
  3: 'bg-[#EDFBFA]',
};
