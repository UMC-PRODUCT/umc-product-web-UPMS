// 피그마 CTA 모달 색. 디자인 시스템 팔레트(3기)가 UPMS 피그마와 달라서(예: teal-600 #02746c ↔ #0b6b64) DS 변수를 덮어쓴다.
// 제목·아이콘 teal-500, 본문 teal-gray-800, 확인 버튼 teal-600(눌렀을 때 teal-700), 취소 버튼 teal-gray-150 + teal-gray-600
export const FIGMA_DIALOG = [
  '[--umc-dialog-title-fg:#0e8179] [--umc-dialog-icon-fg:#0e8179] [--umc-dialog-description-fg:#2e302f]',
  "[&_.umc-button[data-variant='fill']]:[--umc-button-bg:#0b6b64]",
  "[&_.umc-button[data-variant='fill']]:[--umc-button-bg-pressed:#0a5650]",
  "[&_.umc-button[data-variant='weak']]:[--umc-button-bg:#eff0f0]",
  "[&_.umc-button[data-variant='weak']]:[--umc-button-fg:#656b6b]",
].join(' ');
