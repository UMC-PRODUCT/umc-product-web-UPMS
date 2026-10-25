import { type ToastApi } from '@umc-product/react';
import { createContext } from 'react';

// 상단 토스트 구역 안에서도 하단 토스트를 띄울 수 있게, 바깥(하단) 토스트 API를 넘겨 둔다
export const BottomToastContext = createContext<ToastApi | null>(null);
