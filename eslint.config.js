import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'src/routes/routeTree.gen.ts', 'src/types/api.d.ts']),

  // 기본 규칙
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // 라우트 파일은 Route 객체를 export하므로 react-refresh 규칙 제외
  {
    files: ['src/routes/**/*.tsx', 'src/app/main.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // 레이어 경계
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.app.json' },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', mode: 'folder' },
        { type: 'routes', pattern: 'src/routes', mode: 'folder' },
        { type: 'widgets', pattern: 'src/widgets/*', mode: 'folder' },
        { type: 'features', pattern: 'src/features/*', mode: 'folder' },
        { type: 'entities', pattern: 'src/entities/*', mode: 'folder' },
        { type: 'shared', pattern: 'src/shared/*', mode: 'folder' },
        { type: 'types', pattern: 'src/types', mode: 'folder' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['app', 'routes', 'widgets', 'features', 'entities', 'shared', 'types'],
            },
            {
              from: 'routes',
              allow: ['routes', 'widgets', 'features', 'entities', 'shared', 'types'],
            },
            { from: 'widgets', allow: ['features', 'entities', 'shared', 'types'] },
            { from: 'features', allow: ['entities', 'shared', 'types'] },
            { from: 'entities', allow: ['shared', 'types'] },
            { from: 'shared', allow: ['shared', 'types'] },
          ],
          message: '${file.type} 레이어에서 ${dependency.type} 레이어를 import할 수 없습니다.',
        },
      ],
    },
  },

  // Prettier와 충돌하는 규칙 끄기 (항상 마지막)
  prettier,
]);
