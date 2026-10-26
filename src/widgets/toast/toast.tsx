import { ToastProvider as BaseToastProvider, useToast } from '@umc-product/react';
import { type ReactNode } from 'react';

import { BottomToastContext } from './bottomToastContext';

type ToastProviderProps = {
  children: ReactNode;
};

// 디자인 시스템 Toast를 화면 하단(닫기 버튼 포함)에 띄움. 앱 최상단에서 한 번만 감쌈
const ToastProvider = ({ children }: ToastProviderProps) => (
  <BaseToastProvider placement="bottom">{children}</BaseToastProvider>
);

// 피그마: 일부 화면의 토스트는 브라우저 상단에서 112px 아래에 뜬다. 그 구역만 한 번 더 감쌈
// 이 안에서도 하단에 띄워야 하는 토스트는 useAppToast의 showBottom을 쓴다
const TopToastProvider = ({ children }: ToastProviderProps) => {
  const bottomToast = useToast();

  return (
    <BottomToastContext value={bottomToast}>
      <BaseToastProvider placement="top">{children}</BaseToastProvider>
    </BottomToastContext>
  );
};

export { TopToastProvider };
export default ToastProvider;
