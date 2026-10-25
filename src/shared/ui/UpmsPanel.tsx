import { CloseIcon, InfoIcon } from '@umc-product/icons';
import { Dimmed, IconButton, Tooltip } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';

type UpmsPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow: ReactNode; // 위 줄 작은 제목 (예: 소속 지부, 팀원 수동 배정)
  title: ReactNode;
  titleAction?: ReactNode; // 제목 오른쪽 (예: 매칭 해제 버튼, 배정 상태 선택)
  subtitle?: ReactNode; // 예: 닉네임/이름 · 학교
  info?: { title: string; content: ReactNode }; // 위 줄 오른쪽 info 툴팁
  subheader?: ReactNode; // 제목 아래 고정 영역 (예: 검색바, 필터)
  children: ReactNode; // 본문 (남은 높이 안에서 스크롤)
  className?: string; // 크기 (기본 600 × 740)
};

// 피그마 UPMS_Panel: 위 줄(작은 제목 · info · 닫기) + 제목 + 부제 + 고정 영역 + 본문
// 디자인 시스템 Panel(512px, 제목 · 설명 · 하단 버튼)과 구조가 달라서 따로 둠
const UpmsPanel = ({
  open,
  onOpenChange,
  eyebrow,
  title,
  titleAction,
  subtitle,
  info,
  subheader,
  children,
  className = 'h-[740px] w-[600px]',
}: UpmsPanelProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay asChild>
        <Dimmed />
      </Dialog.Overlay>
      <Dialog.Content
        aria-describedby={undefined}
        // 열 때 첫 버튼(info)에 포커스 링이 보이지 않도록 패널 자체에 포커스
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
        className={`fixed top-1/2 left-1/2 z-(--umc-z-dimmed) flex max-h-[calc(100vh-40px)] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-[26px] overflow-hidden rounded-xl bg-white px-8 pb-8 outline-none ${className}`}
      >
        <div className="flex flex-col gap-8 pt-10">
          <div className="flex flex-col gap-4 px-2.5">
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-body-3-semibold text-teal-600">{eyebrow}</p>
              <div className="flex items-center gap-2.5">
                {info && (
                  <Tooltip
                    mode="light"
                    side="left"
                    title={info.title}
                    // 줄바꿈을 정한 문구는 디자인 시스템 최대 너비(240px)를 풂 (app.css tooltip-nowrap)
                    content={
                      <span className="tooltip-nowrap block whitespace-nowrap">{info.content}</span>
                    }
                  >
                    <button
                      type="button"
                      aria-label={`${info.title} 안내`}
                      className="flex text-teal-grey-800"
                    >
                      <InfoIcon size={24} />
                    </button>
                  </Tooltip>
                )}
                <Dialog.Close asChild>
                  {/* 디자인 시스템 PanelCloseButton과 같은 흰색 Icon Button (피그마 26px) */}
                  <IconButton
                    variant="weak"
                    color="white"
                    size="md"
                    icon={<CloseIcon size={24} />}
                    aria-label="닫기"
                  />
                </Dialog.Close>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="text-heading-2-semibold text-teal-grey-800">
                  {title}
                </Dialog.Title>
                {titleAction}
              </div>
              {subtitle && <p className="text-body-2-medium text-teal-grey-500">{subtitle}</p>}
            </div>
          </div>
          {subheader && <div className="px-2.5">{subheader}</div>}
        </div>
        {/* min-h-0이 있어야 남은 높이 안에서 스크롤됨 */}
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default UpmsPanel;
