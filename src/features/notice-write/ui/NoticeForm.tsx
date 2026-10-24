import { CheckIcon, ChevronLeftIcon } from '@umc-product/icons';
import { Button, Checkbox, Dialog, TextButton } from '@umc-product/react';
import { type FormEvent, useState } from 'react';

import {
  type Notice,
  NOTICE_CONTENT_MAX_LENGTH,
  NoticeCard,
  type NoticeInput,
  useNoticeStore,
} from '@/entities/notice';
import { cn } from '@/shared/lib/cn';
import { FIGMA_BUTTON_MD } from '@/shared/ui/buttonStyle';
import { FIGMA_DIALOG } from '@/shared/ui/dialogStyle';

// 제출 중(로딩) → 완료(딤드 뒤에 깔리는 비활성 버튼) 순서로 바뀐다
type SubmitStatus = 'idle' | 'submitting' | 'done';

type NoticeFormProps = {
  chapterId: string;
  notice?: Notice; // 있으면 수정 모드
  onBack: () => void;
  onComplete: () => void;
};

// TODO: 공지 API가 나오면 실제 요청으로 교체
const MOCK_REQUEST_DELAY_MS = 800;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CONTENT_PLACEHOLDER = [
  '내용을 입력하세요.',
  '',
  '특정 파트에게 전달하는 공지는 제목에 기재해주세요',
  'ex. Mobeo',
].join('\n');

const NoticeForm = ({ chapterId, notice, onBack, onComplete }: NoticeFormProps) => {
  const addNotice = useNoticeStore((state) => state.addNotice);
  const updateNotice = useNoticeStore((state) => state.updateNotice);

  const [title, setTitle] = useState(notice?.title ?? '');
  const [content, setContent] = useState(notice?.content ?? '');
  const [required, setRequired] = useState(notice?.required ?? false);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const isEdit = notice !== undefined;
  const actionLabel = isEdit ? '수정' : '게시';
  // 제목과 내용이 모두 있어야 게시할 수 있다
  const canSubmit = title.trim() !== '' && content.trim() !== '' && status === 'idle';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const input: NoticeInput = { title: title.trim(), content, required };
    setStatus('submitting');
    await wait(MOCK_REQUEST_DELAY_MS);

    if (notice) updateNotice(chapterId, notice.id, input);
    else addNotice(chapterId, input);
    setStatus('done');
  };

  return (
    <NoticeCard className="px-[34px] py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <TextButton
          type="button"
          color="neutral"
          size="sm"
          leadingIcon={<ChevronLeftIcon size={16} />}
          onClick={onBack}
          // 피그마: 높이 34px, 좌 8px·우 12px 여백, 아이콘과 글자 간격 4px
          className="h-[34px] min-w-16 gap-1 self-start pr-3 pl-2"
        >
          목록으로
        </TextButton>

        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-2.5 px-4 py-1">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목"
              aria-label="제목"
              className="min-w-0 flex-1 truncate bg-transparent text-heading-2-semibold text-teal-600 outline-none placeholder:text-teal-grey-400"
            />
            <div className="flex shrink-0 items-center gap-5">
              <Checkbox
                color="brand"
                labelPlacement="end"
                // 피그마: 체크 전에는 회색 테두리, 체크하면 브랜드 색
                className="[--umc-checkbox-border:var(--umc-color-border-neutral-strong-400)]"
                checked={required}
                onCheckedChange={setRequired}
              >
                필독
              </Checkbox>
              <Button
                type="submit"
                // 피그마: 수정 화면의 버튼만 연한 배경(weak)이고 나머지는 같다
                variant={isEdit ? 'weak' : 'fill'}
                disabled={!canSubmit && status !== 'submitting'}
                isLoading={status === 'submitting'}
                className={cn(FIGMA_BUTTON_MD, 'min-w-[76px]')}
              >
                {status === 'done' ? `${actionLabel} 완료` : `${actionLabel}하기`}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 rounded-xl bg-teal-grey-50 px-8 pt-6 pb-[30px] shadow-inner-neutral-2">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={CONTENT_PLACEHOLDER}
              aria-label="내용"
              maxLength={NOTICE_CONTENT_MAX_LENGTH}
              className="field-sizing-content min-h-[360px] w-full resize-none bg-transparent text-body-1-regular leading-[1.6] text-teal-grey-900 outline-none placeholder:text-teal-grey-400"
            />
            <p className="flex h-[21px] items-center gap-0.5 text-body-2-regular text-teal-grey-400">
              <span className="text-body-2-medium">{content.length}</span>
              <span>/</span>
              <span className="text-body-2-medium">{NOTICE_CONTENT_MAX_LENGTH}</span>
            </p>
          </div>
        </div>
      </form>

      <Dialog
        open={status === 'done'}
        color="primary"
        className={FIGMA_DIALOG}
        icon={<CheckIcon />}
        title={`${actionLabel} 완료`}
        description={isEdit ? '공지 수정이 완료되었습니다.' : '공지가 등록되었습니다.'}
        confirmLabel="보러가기"
        onConfirm={onComplete}
      />
    </NoticeCard>
  );
};

export default NoticeForm;
