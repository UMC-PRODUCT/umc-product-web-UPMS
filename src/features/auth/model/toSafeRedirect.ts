// 다른 사이트로 보내지 않도록 우리 서비스 경로만 허용 ('//evil.com' 같은 주소 차단)
export const toSafeRedirect = (redirectTo: string | undefined) =>
  redirectTo?.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';
