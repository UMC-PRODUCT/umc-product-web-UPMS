import { CheckPictogram } from '@umc-product/icons';
import { Button, Checkbox, OptionButtonGroup } from '@umc-product/react';
import { useState } from 'react';

import { NoticeCard, type NoticeInput } from '@/entities/notice';
import NoticeDialog from '@/shared/ui/NoticeDialog';

import NoticeContentEditor from './NoticeContentEditor';
import NoticeTitleInput from './NoticeTitleInput';

// 확인창 → 등록 요청(로딩) 순서로 바뀐다
type SubmitStatus = 'idle' | 'confirming' | 'submitting';

type ChapterOption = { id: string; name: string };

type NoticeWriteFormProps = {
  chapters: ChapterOption[]; // 고를 수 있는 지부 (지부장은 본인 지부 하나)
  initialChapterIds: string[];
  onSubmit: (input: NoticeInput, chapterIds: string[]) => void;
  onTitleExceed: () => void;
};

// TODO: 공지 API가 나오면 실제 요청으로 교체
const MOCK_REQUEST_DELAY_MS = 800;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 피그마 '공지 작성': 위에 지부 선택·필독·작성 완료, 아래 카드에 제목과 본문
const NoticeWriteForm = ({
  chapters,
  initialChapterIds,
  onSubmit,
  onTitleExceed,
}: NoticeWriteFormProps) => {
  const [chapterIds, setChapterIds] = useState(initialChapterIds);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [required, setRequired] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  // 지부, 제목, 내용이 모두 있어야 작성 완료할 수 있다
  const canSubmit = chapterIds.length > 0 && title.trim() !== '' && content.trim() !== '';

  const handleConfirm = async () => {
    setStatus('submitting');
    await wait(MOCK_REQUEST_DELAY_MS);
    onSubmit({ title: title.trim(), content, required }, chapterIds);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6 px-3">
          <span className="text-[18px] leading-[1.4] text-teal-grey-800">지부 선택</span>
          <OptionButtonGroup
            type="multiple"
            size="sm"
            aria-label="지부 선택"
            options={chapters.map((chapter) => ({ value: chapter.id, label: chapter.name }))}
            value={chapterIds}
            onValueChange={setChapterIds}
          />
        </div>
        <div className="flex items-center gap-4">
          {/* 피그마: 체크 전 테두리는 Neutral, 체크하면 Brand로 채워진다. DS는 색을 둘이 묶어서 채움 색만 덮어씀 */}
          <Checkbox
            color="neutral"
            className="[--umc-checkbox-checked-bg:var(--umc-color-fill-primary-inverse-medium-500)]"
            labelPlacement="end"
            checked={required}
            onCheckedChange={setRequired}
          >
            필독
          </Checkbox>
          <Button
            size="xs"
            disabled={!canSubmit}
            isLoading={status === 'submitting'}
            onClick={() => setStatus('confirming')}
          >
            작성 완료
          </Button>
        </div>
      </div>

      <NoticeCard className="flex min-h-[560px] flex-col pb-6">
        <div className="flex items-center pt-7 pr-8 pb-6 pl-[38px]">
          <NoticeTitleInput value={title} onChange={setTitle} onExceed={onTitleExceed} />
        </div>
        <NoticeContentEditor value={content} onChange={setContent} className="flex-1" />
      </NoticeCard>

      <NoticeDialog
        open={status === 'confirming'}
        icon={<CheckPictogram size={24} />}
        title="공지를 등록할까요?"
        description="등록되는 즉시 챌린저와 운영진이 확인 할 수 있어요"
        onConfirm={handleConfirm}
        onDismiss={() => setStatus('idle')}
      />
    </div>
  );
};

export default NoticeWriteForm;
