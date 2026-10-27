import { Fragment } from 'react';

type NoticeContentProps = {
  content: string;
};

// 불렛 줄은 '· '로 시작한다 (작성 화면에서 '- '를 치면 바뀐다)
const BULLET = '· ';

// 줄 안의 **굵게** 구간을 나눈다 (구간이 한 줄 전체여도 같다)
const BOLD_SPLIT_PATTERN = /(\*\*.+?\*\*)/g;
const BOLD_PATTERN = /^\*\*(.+)\*\*$/;

// TODO: 공지 본문 형식(마크다운/HTML)이 정해지면 교체. 지금은 줄 단위 텍스트에 **굵게**만 지원한다.
const NoticeContent = ({ content }: NoticeContentProps) => (
  <div className="text-body-1-regular text-teal-grey-900">
    {content.split('\n').map((line, index) => {
      const bullet = line.startsWith(BULLET);
      const text = bullet ? line.slice(BULLET.length) : line;
      const parts = text.split(BOLD_SPLIT_PATTERN).map((part, partIndex) => {
        const bold = BOLD_PATTERN.exec(part)?.[1];
        return bold ? (
          <strong key={partIndex} className="font-bold">
            {bold}
          </strong>
        ) : (
          <Fragment key={partIndex}>{part}</Fragment>
        );
      });

      // 빈 줄도 한 줄 높이를 차지해야 단락 간격이 유지된다
      return bullet ? (
        // 줄바꿈된 둘째 줄이 불렛이 아니라 글자에 맞춰 들여쓰이도록 불렛을 따로 둔다
        // 피그마 노트: 불렛(•)은 왼쪽에서 약 8px, 글자는 약 22px에서 시작한다
        <p key={index} className="flex min-h-[1.6em] pl-2 leading-[1.6]">
          <span aria-hidden className="w-3.5 shrink-0">
            •
          </span>
          <span className="min-w-0">{parts}</span>
        </p>
      ) : (
        <p key={index} className="min-h-[1.6em] leading-[1.6]">
          {parts}
        </p>
      );
    })}
  </div>
);

export default NoticeContent;
