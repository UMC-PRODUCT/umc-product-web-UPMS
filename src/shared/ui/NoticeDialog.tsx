import { Button } from '@umc-product/react';
import { AlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type NoticeDialogProps = {
  open: boolean;
  onConfirm: () => void; // 확인 (닫기)
  icon?: ReactNode; // 24px 그래픽 (예: 체크 픽토그램)
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
};

// 피그마 Web/Dialog (Button Style=Fill): 확인 버튼 하나짜리 안내창
// 디자인 시스템 Dialog는 버튼이 하나면 텍스트 버튼이라, 같은 스타일 클래스로 채운 버튼만 바꿔 씀
// radix AlertDialog라서 열려 있는 radix 모달(패널) 위에서도 클릭 · 포커스가 정상 동작
const NoticeDialog = ({
  open,
  onConfirm,
  icon,
  title,
  description,
  confirmLabel = '확인',
}: NoticeDialogProps) => (
  <AlertDialog.Root open={open} onOpenChange={(next) => !next && onConfirm()}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="umc-dialog__backdrop" />
      <div className="umc-dialog__viewport">
        <AlertDialog.Content
          className="umc-dialog__popup"
          data-color="brand"
          data-button-style="fill"
        >
          <div className="umc-dialog__text">
            <div className="umc-dialog__heading">
              {icon && (
                <span className="umc-dialog__icon" aria-hidden>
                  {icon}
                </span>
              )}
              <AlertDialog.Title className="umc-dialog__title">{title}</AlertDialog.Title>
            </div>
            <AlertDialog.Description className="umc-dialog__description">
              {description}
            </AlertDialog.Description>
          </div>
          <div className="umc-dialog__actions" data-variant="fill" data-color="brand">
            <AlertDialog.Action asChild>
              <Button size="xs" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </div>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default NoticeDialog;
