import { shadowUtilities, textStyleUtilities } from '@umc-product/design-tokens';
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// 디자인 시스템의 텍스트 스타일·그림자 클래스를 등록해야 text-teal-600 같은 색 클래스와 섞어도 지워지지 않는다
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [...textStyleUtilities],
      shadow: [...shadowUtilities],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
