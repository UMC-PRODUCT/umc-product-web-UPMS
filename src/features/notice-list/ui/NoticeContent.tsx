type NoticeContentProps = {
  content: string;
};

const HEADING_PATTERN = /^\*\*(.+)\*\*$/;

// TODO: 공지 본문 형식(마크다운/HTML)이 정해지면 교체. 지금은 줄 단위 텍스트이고 **소제목**만 굵게 보여준다.
const NoticeContent = ({ content }: NoticeContentProps) => (
  <div className="text-body-1-regular text-teal-grey-900">
    {content.split('\n').map((line, index) => {
      const heading = HEADING_PATTERN.exec(line)?.[1];

      return heading ? (
        <p key={index} className="leading-[1.6] font-bold">
          {heading}
        </p>
      ) : (
        // 빈 줄도 한 줄 높이를 차지해야 단락 간격이 유지된다
        <p key={index} className="min-h-[1.6em] leading-[1.6]">
          {line}
        </p>
      );
    })}
  </div>
);

export default NoticeContent;
