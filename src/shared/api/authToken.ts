// TODO: 정식 로그인(다른 팀)이 붙으면 그쪽 토큰 저장 방식으로 교체. 지금은 QA용 임시 로그인이 넣은 토큰을 씀
const ACCESS_TOKEN_KEY = 'auth:accessToken';
const REFRESH_TOKEN_KEY = 'auth:refreshToken';

// 시크릿 창 · 저장소 차단 환경에서는 접근만 해도 에러가 나서 감쌈
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getAccessToken = () => read(ACCESS_TOKEN_KEY);

export const setAuthTokens = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken?: string;
}) => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // 저장이 막힌 환경에서는 새로고침하면 다시 로그인해야 함
  }
};

export const clearAuthTokens = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // 지울 수 없으면 그대로 둠
  }
};
