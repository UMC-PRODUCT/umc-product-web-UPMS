import { CheckPictogram } from '@umc-product/icons';
import { Button } from '@umc-product/react';
import { useState } from 'react';

import {
  type PartMatching,
  type ProjectMatchingResult,
  type UnassignedChallenger,
  UnassignedChallengerSheet,
} from '@/features/matching-status';
import NoticeDialog from '@/shared/ui/NoticeDialog';
import UpmsPanel from '@/shared/ui/UpmsPanel';
import { SearchBar } from '@/widgets/searchBar';

type ManualAssignModalProps = {
  target: { project: ProjectMatchingResult; part: PartMatching } | null; // null이면 닫힘
  challengers: UnassignedChallenger[]; // 아직 배정되지 않은 챌린저 전체
  onClose: () => void;
  onAssign: (challenger: UnassignedChallenger) => void; // 해당 프로젝트 · 파트에 배정
};

// 피그마 팀원 수동 배정 모달: 매칭 결과 시트의 빈 칸에서 열림
// 처음엔 검색바만, 검색하면 빈 칸의 파트에 맞는 미배정 챌린저만 보여 주고 한 명을 골라 배정 → 배정 완료 안내
const ManualAssignModal = ({ target, challengers, onClose, onAssign }: ManualAssignModalProps) => {
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 배정 직후 목록. 배정 완료 안내가 떠 있는 동안 뒤 목록이 바뀌지 않게 붙잡아 둠 (null이면 배정 전)
  const [assignedSnapshot, setAssignedSnapshot] = useState<UnassignedChallenger[] | null>(null);

  const trimmedKeyword = keyword.trim();
  // 빈 칸의 파트 + 검색어(닉네임 · 이름 · 학교 일부)로 거름
  const candidates =
    assignedSnapshot ??
    (target
      ? challengers.filter(
          ({ part, challengerName, schoolName }) =>
            part === target.part.part &&
            (challengerName.includes(trimmedKeyword) || schoolName.includes(trimmedKeyword)),
        )
      : []);
  const selected = candidates.find(({ challengerId }) => challengerId === selectedId);

  const close = () => {
    setKeyword('');
    setSelectedId(null);
    setAssignedSnapshot(null);
    onClose();
  };

  const handleAssign = () => {
    if (!selected) return;
    setAssignedSnapshot(candidates);
    onAssign(selected);
  };

  return (
    <UpmsPanel
      open={target !== null}
      onOpenChange={(open) => !open && close()}
      eyebrow="팀원 수동 배정"
      title={target?.project.projectName}
      subtitle={target && `${target.project.pmName} · ${target.project.pmSchoolName}`}
      info={{
        title: '팀원 수동 배정',
        content: (
          <>
            매칭 차수나 마감 기한과 관계없이 팀원을 추가하거나 해제할 수 있어요.
            <br />
            변경 사항은 즉시 반영돼요.
          </>
        ),
      }}
      subheader={
        <SearchBar
          value={keyword}
          onValueChange={(value) => {
            setKeyword(value);
            setSelectedId(null);
          }}
          placeholder="닉네임 또는 이름으로 검색하세요"
          className="w-full"
        />
      }
    >
      {/* 피그마 기본 상태: 검색 전에는 목록 없이 검색바만 */}
      {trimmedKeyword !== '' &&
        (candidates.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-body-2-medium text-teal-grey-400">
            배정할 수 있는 챌린저가 없어요.
          </p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center gap-12">
            <div className="flex min-h-0 w-full flex-1 flex-col">
              <UnassignedChallengerSheet
                challengers={candidates}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <Button size="md" disabled={!selected} onClick={handleAssign} className="w-[176px]">
              해당 프로젝트에 배정
            </Button>
          </div>
        ))}
      <NoticeDialog
        open={assignedSnapshot !== null}
        onConfirm={close}
        icon={<CheckPictogram size={24} />}
        title="배정 완료"
        description="팀원 수동 배정이 완료됐어요."
      />
    </UpmsPanel>
  );
};

export default ManualAssignModal;
