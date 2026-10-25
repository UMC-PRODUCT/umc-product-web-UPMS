import { CheckCircleIcon } from '@umc-product/icons';
import { type ToastOptions, useToast } from '@umc-product/react';
import { type ReactNode, useMemo } from 'react';

type ShowToastOptions = Omit<ToastOptions, 'message'>;

// 피그마 Toast: 체크 아이콘 + 메시지. color만 바꿔 쓰고 아이콘은 필요하면 덮어씀
const useAppToast = () => {
  const toast = useToast();

  return useMemo(
    () => ({
      show: (message: ReactNode, options?: ShowToastOptions) =>
        toast.show({ icon: <CheckCircleIcon weight="fill" />, ...options, message }),
      close: toast.close,
    }),
    [toast],
  );
};

export default useAppToast;
