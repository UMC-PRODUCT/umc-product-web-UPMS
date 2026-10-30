export type QaAccount = { label: string; email: string };

// .env.development.local 의 VITE_QA_ACCOUNTS="최고 관리자=a@umc.com,지부장=b@umc.com" 형식
// 비밀번호는 저장하지 않고 화면에서 직접 입력
export const parseQaAccounts = (raw: string | undefined): QaAccount[] =>
  (raw ?? '')
    .split(',')
    .map((entry) => {
      const separator = entry.indexOf('=');
      if (separator < 0) return { label: '', email: '' };
      return {
        label: entry.slice(0, separator).trim(),
        email: entry.slice(separator + 1).trim(),
      };
    })
    .filter(({ label, email }) => label && email);

export const QA_ACCOUNTS = parseQaAccounts(import.meta.env.VITE_QA_ACCOUNTS);
