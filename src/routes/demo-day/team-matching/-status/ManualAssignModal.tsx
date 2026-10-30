import { CheckPictogram } from '@umc-product/icons';
import { Button } from '@umc-product/react';
import { useState } from 'react';

import {
  type PartMatching,
  type ProjectMatchingResult,
  UnassignedChallengerSheet,
  useAssignProjectMember,
  useMatchingCandidates,
} from '@/features/matching-status';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import NoticeDialog from '@/shared/ui/NoticeDialog';
import UpmsPanel from '@/shared/ui/UpmsPanel';
import { SearchBar } from '@/widgets/searchBar';
import { useAppToast } from '@/widgets/toast';

// 글자마다 요청하지 않도록 입력이 멈추면(300ms) 검색, 계속 입력해도 1초마다는 중간 결과
const SEARCH_DEBOUNCE = { delay: 300, maxWait: 1000 };

type ManualAssignModalProps = {
  target: { project: ProjectMatchingResult; part: PartMatching } | null; // null이면 닫힘
  onClose: () => void;
};

// 피그마 팀원 수동 배정 모달: 매칭 결과 시트의 빈 칸에서 열림
// 처음엔 검색바만, 검색하면 빈 칸의 파트에 맞는 미배정 챌린저(서버 후보 조회)를 보여 주고 한 명을 골라 배정 → 배정 완료 안내
const ManualAssignModal = ({ target, onClose }: ManualAssignModalProps) => {
  const [keyword, setKeyword] = useState('');
  const searchKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [assigned, setAssigned] = useState(false);
  const toast = useAppToast();

  const candidates = useMatchingCandidates(
    target && { projectId: target.project.projectId, part: target.part.part },
    searchKeyword,
  );
  const assign = useAssignProjectMember();
  const challengers = candidates.data ?? [];
  const selected = challengers.find(({ memberId }) => memberId === selectedId);

  const close = () => {
    setKeyword('');
    setSelectedId(null);
    setAssigned(false);
    onClose();
  };

  const handleAssign = () => {
    if (!target || !selected) return;
    assign.mutate(
      { projectId: target.project.projectId, memberId: selected.memberId, part: target.part.part },
      {
        onSuccess: () => setAssigned(true),
        // 정원 초과 · 중복 배정 등 서버가 거절한 사유를 보여 줌
        onError: (error) => toast.show(error.message, { color: 'error' }),
      },
    );
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
      {/* TODO: 불러오기 실패 화면이 피그마에 나오면 교체 */}
      {candidates.isError && (
        <p role="alert" className="text-body-3-medium text-red-500">
          {candidates.error.message}
        </p>
      )}
      {candidates.isSuccess &&
        (challengers.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-body-2-medium text-teal-grey-400">
            배정할 수 있는 챌린저가 없어요.
          </p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center gap-12">
            <div className="flex min-h-0 w-full flex-1 flex-col">
              <UnassignedChallengerSheet
                challengers={challengers}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <Button
              size="md"
              disabled={!selected || assign.isPending}
              onClick={handleAssign}
              className="w-[176px]"
            >
              해당 프로젝트에 배정
            </Button>
          </div>
        ))}
      <NoticeDialog
        open={assigned}
        onConfirm={close}
        icon={<CheckPictogram size={24} />}
        title="배정 완료"
        description="팀원 수동 배정이 완료됐어요."
      />
    </UpmsPanel>
  );
};

export default ManualAssignModal;
