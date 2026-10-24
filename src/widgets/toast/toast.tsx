import { ToastProvider as BaseToastProvider } from '@umc-product/react';
import { type ReactNode } from 'react';

type ToastProviderProps = {
  children: ReactNode;
};

// 디자인 시스템 Toast를 화면 하단(닫기 버튼 포함)에 띄움. 앱 최상단에서 한 번만 감쌈
const ToastProvider = ({ children }: ToastProviderProps) => (
  <BaseToastProvider placement="bottom">{children}</BaseToastProvider>
);

export default ToastProvider;
