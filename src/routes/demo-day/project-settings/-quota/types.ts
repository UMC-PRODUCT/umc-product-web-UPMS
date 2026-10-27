export const PARTS = ['pm', 'design', 'webPe', 'mobilePe'] as const;
export type Part = (typeof PARTS)[number];

export const PART_LABEL: Record<Part, string> = {
  pm: 'PM',
  design: 'Design',
  webPe: 'Web PE',
  mobilePe: 'Mobile PE',
};

export type DraftValues = Record<string, Record<Part, number | null>>;
