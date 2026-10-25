import { WarningTriangleIcon } from '@umc-product/icons';

import NoticeDialog from '@/shared/ui/NoticeDialog';

type DeleteNoticeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

// 피그마 Web/Dialog (Warning): 공지 삭제 확인
// DS Dialog는 배경이 Weak 딤드 + 그림자라서, 딤드 Medium을 쓰는 NoticeDialog로 그림
const DeleteNoticeDialog = ({ open, onOpenChange, onConfirm }: DeleteNoticeDialogProps) => (
  <NoticeDialog
    open={open}
    color="error"
    icon={<WarningTriangleIcon weight="fill" size={24} className="text-red-500" />}
    title="공지를 삭제할까요?"
    description="삭제한 공지는 복구할 수 없어요."
    cancelLabel="돌아가기"
    confirmLabel="삭제하기"
    onConfirm={onConfirm}
    onDismiss={() => onOpenChange(false)}
  />
);

export default DeleteNoticeDialog;
