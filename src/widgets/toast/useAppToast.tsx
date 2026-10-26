import { CheckCircleIcon } from '@umc-product/icons';
import { type ToastOptions, useToast } from '@umc-product/react';
import { type ReactNode, use, useMemo } from 'react';

import { BottomToastContext } from './bottomToastContext';

type ShowToastOptions = Omit<ToastOptions, 'message'>;

// 피그마 Toast: 체크 아이콘 + 메시지. color만 바꿔 쓰고 아이콘은 필요하면 덮어씀
const useAppToast = () => {
  const toast = useToast();
  // 상단 토스트 구역 안일 때만 있다. 구역 밖에서는 기본 토스트가 이미 하단이다
  const bottomToast = use(BottomToastContext) ?? toast;

  return useMemo(() => {
    const create = (api: typeof toast) => (message: ReactNode, options?: ShowToastOptions) =>
      api.show({ icon: <CheckCircleIcon weight="fill" />, ...options, message });

    return {
      show: create(toast),
      // 상단 구역 안에서 이 토스트만 하단에 띄울 때 (예: 공지 삭제)
      showBottom: create(bottomToast),
      close: toast.close,
    };
  }, [toast, bottomToast]);
};

export default useAppToast;
