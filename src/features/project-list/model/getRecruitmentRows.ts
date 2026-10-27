import type { PartRecruitment, Project, ProjectPeriod, RecruitPart } from './types';

export type RecruitmentRow = {
  part: RecruitPart;
  label: string;
  applied: number;
  capacity: number;
  status: PartRecruitment['status'];
};

// 목록 카드는 PE를 "Web PE", 상세 모달은 플랫폼 이름("Web")으로 표기
const PART_LABEL: Record<'card' | 'detail', Record<RecruitPart, string>> = {
  card: { DESIGN: 'Design', WEB_PE: 'Web PE', MOBILE_PE: 'Mobile PE' },
  detail: { DESIGN: 'Design', WEB_PE: 'Web', MOBILE_PE: 'Mobile' },
};

// 디자인 매칭 기간에는 Design만 TO를 표기하고, Web · Mobile은 라벨만 두고 0/0으로 표기
export const getRecruitmentRows = (
  { recruitments }: Pick<Project, 'recruitments'>,
  { track }: Pick<ProjectPeriod, 'track'>,
  variant: 'card' | 'detail',
): RecruitmentRow[] =>
  recruitments.map(({ part, applied, capacity, status }) => {
    const hideQuota = track === 'DESIGN' && part !== 'DESIGN';
    return {
      part,
      label: hideQuota ? PART_LABEL.detail[part] : PART_LABEL[variant][part],
      applied: hideQuota ? 0 : applied,
      capacity: hideQuota ? 0 : capacity,
      status,
    };
  });
