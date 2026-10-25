import { CloseIcon } from '@umc-product/icons';
import { Dimmed, IconButton, NumberTag, PartTag, type PartTagPart } from '@umc-product/react';
import { Dialog } from 'radix-ui';

import type { PartRecruitment, RecruitPart, TeamMember, TeamMemberRound } from '../model/types';

const PART_TAG: Record<RecruitPart, { part: PartTagPart; label: string }> = {
  DESIGN: { part: 'design', label: 'Design' },
  WEB_PE: { part: 'web-pe', label: 'Web PE' },
  MOBILE_PE: { part: 'mobile-pe', label: 'Mobile PE' },
};

const ROUND_TEXT: Record<TeamMemberRound, string> = { 1: '1', 2: '2', 3: '3', RANDOM: 'R' };

// 피그마 Web/Upms/Team Member Card: 매칭된 차수 + 닉네임/이름 + 학교
const TeamMemberCard = ({ challengerName, schoolName, round }: TeamMember) => (
  <li className="flex w-[222px] items-start gap-2 rounded-[10px] border border-teal-grey-100 bg-white px-3 py-2.5">
    <NumberTag aria-hidden variant="tertiary" className="mt-1 shrink-0">
      {ROUND_TEXT[round]}
    </NumberTag>
    <span className="sr-only">{round === 'RANDOM' ? '랜덤' : `${round}차`} 매칭</span>
    <div className="min-w-0 flex-1">
      <p className="-mb-0.5 truncate text-body-3-semibold text-teal-grey-800">{challengerName}</p>
      <p className="truncate text-caption-2-regular text-teal-grey-600">{schoolName}</p>
    </div>
  </li>
);

type TeamCompositionPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruitments: PartRecruitment[];
};

// 피그마 팀원 구성: 파트별 매칭 인원 / 모집 인원과 매칭된 팀원 카드
// 팀원이 아직 없는 파트는 "매칭이 진행 중이에요"
// 프로젝트 상세 모달(radix) 위에 겹쳐 뜨므로 같은 radix Dialog로 만듦
const TeamCompositionPanel = ({ open, onOpenChange, recruitments }: TeamCompositionPanelProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay asChild>
        <Dimmed />
      </Dialog.Overlay>
      <Dialog.Content
        aria-describedby={undefined}
        className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) flex max-h-[calc(100vh-40px)] w-[546px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white pb-6 shadow-drop-neutral-2 outline-none"
      >
        <div className="flex items-start">
          <div className="flex-1 pt-8 pr-4 pl-8">
            <Dialog.Title className="px-1 text-heading-2-semibold text-teal-grey-900">
              팀원 구성
            </Dialog.Title>
          </div>
          <div className="px-4 pt-5">
            <Dialog.Close asChild>
              <IconButton
                variant="weak"
                color="white"
                size="sm"
                icon={<CloseIcon size={20} />}
                aria-label="닫기"
              />
            </Dialog.Close>
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-[50px] overflow-y-auto px-8 pt-6 pb-[34px]">
          {recruitments.map(({ part, capacity, members }) => {
            const { part: tagPart, label } = PART_TAG[part];
            return (
              <section key={part} className="flex flex-col gap-4 px-2.5">
                <div className="flex items-center justify-between">
                  <PartTag part={tagPart} size="md">
                    {label}
                  </PartTag>
                  <span
                    aria-label={`${members.length}명 매칭, 모집 ${capacity}명`}
                    className="text-body-2-regular text-teal-grey-300"
                  >
                    {members.length}/{capacity}
                  </span>
                </div>
                {members.length === 0 ? (
                  <p className="flex h-[60px] items-center justify-center text-body-3-regular text-teal-grey-500">
                    매칭이 진행 중이에요
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-x-3 gap-y-2.5">
                    {members.map((member) => (
                      <TeamMemberCard key={member.memberId} {...member} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default TeamCompositionPanel;
