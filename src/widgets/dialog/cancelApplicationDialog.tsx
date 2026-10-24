import { WarningTriangleIcon } from '@umc-product/icons';
import { Dialog } from '@umc-product/react';

type CancelApplicationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onConfirm: () => void;
  className?: string;
};

// 피그마 Web/Dialog (Warning): 프로젝트 지원 취소 확인
const CancelApplicationDialog = ({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  className,
}: CancelApplicationDialogProps) => (
  <Dialog
    className={className}
    open={open}
    onOpenChange={onOpenChange}
    color="error"
    icon={<WarningTriangleIcon weight="fill" size={24} className="text-red-500" />}
    title="프로젝트 지원 취소"
    description={
      <>
        <strong className="font-semibold">{projectName} 지원을 취소할까요?</strong>
        <br />
        <br />
        지원을 취소하면 지원 내역이 삭제되며, 다시 복구할 수 없어요.
        <br />
        다만, 현재 차수의 지원 기간 내에는 다시 지원할 수 있어요.
      </>
    }
    cancelLabel="돌아가기"
    confirmLabel="지원 취소"
    onConfirm={onConfirm}
  />
);

export default CancelApplicationDialog;
