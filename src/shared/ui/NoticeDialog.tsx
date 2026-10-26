import { Button, Dimmed } from '@umc-product/react';
import { AlertDialog } from 'radix-ui';
import { type ReactNode, useRef } from 'react';

import { cn } from '@/shared/lib/cn';

type NoticeDialogProps = {
  open: boolean;
  onConfirm: () => void; // 확인 버튼
  onDismiss?: () => void; // ESC 등 확인 버튼 말고 닫힐 때 (없으면 onConfirm과 같다)
  icon?: ReactNode; // 24px 그래픽 (예: 체크 픽토그램)
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string; // 있으면 취소 버튼이 붙는다 (취소는 onDismiss)
  color?: 'brand' | 'error';
  className?: string; // 색 등 디자인 시스템 변수를 덮어쓸 때
};

// 피그마 Web/Dialog (Button Style=Fill): 확인(+취소) 버튼 안내창
// 디자인 시스템 Dialog는 버튼이 하나면 텍스트 버튼이고 배경이 Weak 딤드라서, 같은 스타일 클래스로 직접 구성함
// radix AlertDialog라서 열려 있는 radix 모달(패널) 위에서도 클릭 · 포커스가 정상 동작
const NoticeDialog = ({
  open,
  onConfirm,
  onDismiss,
  icon,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel,
  color = 'brand',
  className,
}: NoticeDialogProps) => {
  // 확인 버튼을 눌러 닫힌 경우에는 onConfirm을 이미 불렀으니 닫힘 이벤트에서 다시 부르지 않는다
  const confirmedRef = useRef(false);

  const handleOpenChange = (next: boolean) => {
    if (next) return;
    if (confirmedRef.current) {
      confirmedRef.current = false;
      return;
    }
    (onDismiss ?? onConfirm)();
  };

  const handleConfirm = () => {
    confirmedRef.current = true;
    onConfirm();
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        {/* 피그마 Dimmed 인스턴스(Intensity=Medium). 다이얼로그 z-index로 맞춰 radix 패널 위에 뜨게 한다 */}
        <AlertDialog.Overlay asChild>
          <Dimmed intensity="medium" className="z-(--umc-z-dialog)" />
        </AlertDialog.Overlay>
        <div className="umc-dialog__viewport">
          <AlertDialog.Content
            className={cn('umc-dialog__popup shadow-none', className)}
            data-color={color}
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
            <div className="umc-dialog__actions" data-variant="fill" data-color={color}>
              {cancelLabel !== undefined && (
                <AlertDialog.Cancel asChild>
                  <Button size="xs" variant="weak" color="neutral">
                    {cancelLabel}
                  </Button>
                </AlertDialog.Cancel>
              )}
              <AlertDialog.Action asChild>
                <Button
                  size="xs"
                  // DS Dialog와 같게: error는 연한 빨강 버튼, brand는 채운 버튼
                  variant={color === 'error' ? 'weak' : 'fill'}
                  color={color === 'error' ? 'red' : 'brand'}
                  onClick={handleConfirm}
                >
                  {confirmLabel}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default NoticeDialog;
