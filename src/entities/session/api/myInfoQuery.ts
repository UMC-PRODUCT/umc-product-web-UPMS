import { queryOptions } from '@tanstack/react-query';

import { getMyInfo } from './getMyInfo';

// 라우트 beforeLoad에서 화면을 그리기 전에 불러올 수 있도록 queryOptions로 둠
export const myInfoQueryOptions = queryOptions({
  queryKey: ['member', 'me'],
  queryFn: getMyInfo,
});
