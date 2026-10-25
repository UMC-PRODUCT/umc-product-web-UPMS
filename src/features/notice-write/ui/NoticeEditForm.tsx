import { Button, Checkbox } from '@umc-product/react';
import { useState } from 'react';

import type { Notice, NoticeInput } from '@/entities/notice';

import NoticeContentEditor from './NoticeContentEditor';
import NoticeTitleInput from './NoticeTitleInput';

type NoticeEditFormProps = {
  notice: Notice;
  onSubmit: (input: NoticeInput) => void;
  onTitleExceed: () => void;
};

// TODO: 공지 API가 나오면 실제 요청으로 교체
const MOCK_REQUEST_DELAY_MS = 800;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 피그마 '공지 수정': 목록 안에서 제목·필독·본문을 바로 고친다
const NoticeEditForm = ({ notice, onSubmit, onTitleExceed }: NoticeEditFormProps) => {
  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content);
  const [required, setRequired] = useState(notice.required);
  const [submitting, setSubmitting] = useState(false);

  // 내용이 수정되어야 수정 완료 버튼이 활성화된다 (제목, 본문, 필독 여부 모두 수정 가능)
  const isChanged =
    title !== notice.title || content !== notice.content || required !== notice.required;
  const canSubmit = isChanged && title.trim() !== '' && content.trim() !== '';

  const handleSubmit = async () => {
    setSubmitting(true);
    await wait(MOCK_REQUEST_DELAY_MS);
    onSubmit({ title: title.trim(), content, required });
  };

  return (
    <div className="flex flex-col gap-px">
      <div className="flex h-[68px] items-center gap-2.5 py-4 pr-8 pl-[38px]">
        <NoticeTitleInput
          value={title}
          onChange={setTitle}
          onExceed={onTitleExceed}
          className="text-teal-600"
        />
        <div className="flex shrink-0 items-center gap-4">
          {/* 작성 화면과 같게: 체크 전 테두리는 Neutral, 체크하면 Brand로 채워진다 */}
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
            variant="weak"
            disabled={!canSubmit}
            isLoading={submitting}
            onClick={handleSubmit}
          >
            수정 완료
          </Button>
        </div>
      </div>
      <NoticeContentEditor value={content} onChange={setContent} />
    </div>
  );
};

export default NoticeEditForm;
