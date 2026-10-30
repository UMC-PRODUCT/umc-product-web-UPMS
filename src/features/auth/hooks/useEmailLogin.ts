import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { setAuthTokens } from '@/shared/api/authToken';

import { loginWithEmail } from '../api/loginWithEmail';
import { toSafeRedirect } from '../model/toSafeRedirect';

type EmailLoginInput = { email: string; password: string; redirectTo: string };

// 받은 토큰을 저장하고 원래 보던 화면으로 돌아감
export const useEmailLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: EmailLoginInput) => loginWithEmail({ email, password }),
    onSuccess: async ({ accessToken, refreshToken }, { redirectTo }) => {
      if (!accessToken) throw new Error('토큰을 받지 못했어요. 다시 로그인해 주세요.');
      setAuthTokens({ accessToken, refreshToken });
      // 이전 계정으로 불러온 데이터(내 정보 · 권한 등)가 남지 않도록 비움
      queryClient.clear();
      await navigate({ href: toSafeRedirect(redirectTo), replace: true });
    },
  });
};
