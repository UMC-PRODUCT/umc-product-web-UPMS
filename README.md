# UMC Product UPMS

## 🚀 시작하기

### 1. 요구 사항

- **Node.js 22** (`.nvmrc` 기준)
- **npm 10 이상**

```bash
nvm install   # 처음 한 번
nvm use
```

> 이 프로젝트는 **npm만 사용**합니다. pnpm, yarn으로 설치하지 마세요.
> 버전이 맞지 않으면 `engine-strict` 설정 때문에 설치가 실패합니다.

### 2. GitHub Packages 토큰 설정 (최초 1회)

디자인 시스템 패키지를 GitHub Packages에서 받기 때문에 개인 토큰이 필요합니다.

1. GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)**
2. 아래와 같이 설정 후 생성
   - **Scopes**: `read:packages`
   - **Expiration**: **30일 이하** (UMC-PRODUCT 조직 정책상 30일 초과 토큰은 차단됩니다)
3. 토큰 목록에서 **Configure SSO → UMC-PRODUCT Authorize** (SSO가 설정된 경우)
4. **내 컴퓨터의 `~/.npmrc`** 에 토큰 추가

```bash
echo "//npm.pkg.github.com/:_authToken=ghp_발급받은토큰" >> ~/.npmrc
```

5. 확인

```bash
npm whoami --registry=https://npm.pkg.github.com   # GitHub 아이디가 나오면 성공
```

> ⚠️ 토큰은 **절대 레포의 `.npmrc`에 넣지 마세요.** 레포의 `.npmrc`에는 레지스트리 주소만 있습니다.
> 토큰이 만료되면 재발급 후 `~/.npmrc`의 해당 줄만 교체하면 됩니다.

### 3. 설치 및 실행

```bash
git clone https://github.com/UMC-PRODUCT/umc-product-web-activity.git
cd umc-product-web-activity

npm ci                 # package-lock.json 기준 설치 (Husky도 자동 설정)
cp .env.example .env   # 환경 변수 설정
npm run dev            # http://localhost:5173
```

| 환경 변수      | 설명          |
| -------------- | ------------- |
| `VITE_API_URL` | API 서버 주소 |

> 패키지를 추가할 때는 `npm install <패키지>`를 사용하고, 변경된 `package-lock.json`을 함께 커밋해 주세요.

<br>

## 📜 스크립트

| 명령어                 | 설명                                                  |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | 개발 서버 실행                                        |
| `npm run build`        | 타입 검사 후 프로덕션 빌드                            |
| `npm run lint`         | ESLint 검사 (import 정렬, 레이어 경계)                |
| `npm run lint:fix`     | ESLint 자동 수정                                      |
| `npm run format`       | Prettier 포맷 적용                                    |
| `npm run format:check` | Prettier 포맷 검사                                    |
| `npm run typecheck`    | 타입 검사                                             |
| `npm run test`         | Vitest 실행                                           |
| `npm run api:types`    | OpenAPI 스펙에서 API 타입 생성 (`src/types/api.d.ts`) |

<br>

## 📁 폴더 구조

```
src/
├── app/        # 앱을 시작하는 곳. Provider 연결과 전역 스타일만 둠
├── routes/     # 주소와 화면을 연결. 화면 조립만 하고 로직은 아래 레이어로 내림
├── widgets/    # 헤더, 사이드바처럼 여러 페이지에 반복되는 큰 화면 단위
├── features/   # "지원서 작성", "멤버 관리"처럼 사용자가 하는 행동 단위
├── entities/   # 지원서, 멤버, 프로젝트 같은 도메인 데이터와 그 표시 방식
├── shared/     # 특정 도메인과 무관한 공용 코드 (API 클라이언트, 유틸, 디자인 시스템 연결)
└── types/      # 여러 레이어가 같이 쓰는 타입 (OpenAPI 생성 타입)
```

### 레이어 규칙

상위 레이어는 하위 레이어만 import할 수 있습니다. **ESLint가 자동으로 검사**하며, 위반 시 커밋이 막힙니다.

```
app → routes → widgets → features → entities → shared → types
```

- `features`끼리, `entities`끼리는 서로 import할 수 없습니다.
- `@/` 경로 별칭을 사용합니다. (예: `import { cn } from '@/shared/lib/cn'`)

### 직접 수정하지 않는 파일

| 파일                          | 생성 방법                                     |
| ----------------------------- | --------------------------------------------- |
| `src/routes/routeTree.gen.ts` | 개발 서버 실행 시 TanStack Router가 자동 생성 |
| `src/types/api.d.ts`          | `npm run api:types`로 생성                    |

<br>

## 🤝 협업 규칙

자세한 내용은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고해 주세요.

### 브랜치 전략 (Git Flow)

| 브랜치                   | 용도                                      |
| ------------------------ | ----------------------------------------- |
| `main`                   | 배포된 버전, 버전 태그 관리               |
| `develop`                | 개발 통합 (**기본 브랜치**)               |
| `feature/#이슈번호-설명` | 기능 개발 → `develop`으로 PR              |
| `release/vX.Y.Z`         | 배포 전 QA → `main`, `develop`으로 PR     |
| `hotfix/vX.Y.Z`          | 운영 긴급 수정 → `main`, `develop`으로 PR |

### 작업 흐름

1. 이슈 생성 (템플릿 사용)
2. `develop`에서 브랜치 생성
3. 커밋 컨벤션에 맞춰 커밋 (Husky가 커밋 시 ESLint, Prettier 자동 실행)
4. `develop`을 base로 PR 생성, 본문에 `close #이슈번호` 작성
5. **팀원 전원(작성자 제외 3명) 승인** 후 머지

> `main`, `develop`에는 직접 push할 수 없습니다. 모든 변경은 PR로 올려 주세요.

### 커밋 컨벤션

```
type: 작업 내용 요약 (#이슈번호)
```

`feat` · `fix` · `refactor` · `style` · `design` · `test` · `docs` · `chore` · `remove` · `rename`

예시: `feat: 로그인 페이지 UI 구현 (#12)`

<br>

## 🔌 API 타입 생성

백엔드 API 스펙이 변경되면 아래 명령으로 타입을 다시 생성하고 함께 커밋합니다.

```bash
npm run api:types
```

<br>

## 🧯 트러블슈팅

| 증상                                       | 해결                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| `npm ci` 중 `401` / `403` 에러             | GitHub Packages 토큰 만료 또는 SSO 미승인 → 토큰 재발급 후 `~/.npmrc` 교체 |
| `EBADENGINE` / `engine` 관련 에러          | Node 버전 확인 → `nvm use`                                                 |
| `routeTree.gen`을 찾을 수 없다는 타입 에러 | `npm run dev`를 한 번 실행하면 자동 생성                                   |
| 커밋이 ESLint 에러로 막힘                  | 메시지 확인 후 수정, 대부분 `npm run lint:fix`로 해결                      |
| `git push` 시 `GH013` 에러                 | `main`/`develop` 직접 push 불가 → 브랜치 생성 후 PR                        |

<br>

## 💻 권장 개발 환경

레포를 VS Code로 열면 추천 확장 프로그램 설치 안내가 표시됩니다. 저장 시 자동 포맷이 적용됩니다.

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense

<br>

## 🔗 관련 링크

| 이름        | 링크 |
| ----------- | ---- |
| Figma       |      |
| Notion      |      |
| API 문서    |      |
| 백엔드 레포 |      |

<br>
