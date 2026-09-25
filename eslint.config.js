import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const gitignore = fileURLToPath(new URL('.gitignore', import.meta.url));

/**
 * ESLint 9 flat config. #89 에서 `.eslintrc.cjs`(ESLint 8, airbnb-base) 를 옮겼다.
 *
 * airbnb 는 flat config 지원이 부실하고 끄는 줄이 많아 걷어냈다. 대신 CLAUDE.md 가 적어 둔 규칙
 * (eqeqeq, no-nested-ternary 등)과 예전 설정에서 켜 두었던 규칙만 직접 옮겼다.
 */
export default tseslint.config(
  includeIgnoreFile(gitignore),
  { ignores: ['.react-router/**', 'storybook-static/**'] },

  js.configs.recommended,
  tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  storybook.configs['flat/recommended'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: { version: 'detect' },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true })],
      'import-x/internal-regex': '^@/',
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // airbnb-base 에서 받던 규칙 중 CLAUDE.md 가 적어 둔 것
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-nested-ternary': 'error',
      'no-alert': 'warn',
      'no-warning-comments': [
        'warn',
        { terms: ['TODO', 'FIXME', 'XXX', 'BUG', 'HOLD'], location: 'anywhere' },
      ],

      // react-hooks v7 의 나머지 규칙은 React Compiler 용이다. 이 프로젝트는 컴파일러를 쓰지 않는다
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react/no-unknown-property': ['error', { ignore: ['color-theme', 'css'] }],
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'error',

      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'off',
      // React.Children 같은 표기를 막는다. 이 프로젝트는 두 표기를 섞어 쓰고, 둘 다 같은 값이다
      'import-x/no-named-as-default-member': 'off',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['sibling', 'parent', 'index'],
            'type',
            'unknown',
          ],
          pathGroups: [
            { pattern: '@/app/**', group: 'internal', position: 'after' },
            { pattern: '@/pages/**', group: 'internal', position: 'after' },
            { pattern: '@/modules/**', group: 'internal', position: 'after' },
            { pattern: '@/features/**', group: 'internal', position: 'after' },
            { pattern: '@/entities/**', group: 'internal', position: 'after' },
            { pattern: '@/commons/**', group: 'internal', position: 'after' },
          ],
          'newlines-between': 'always',
        },
      ],

      '@typescript-eslint/no-empty-function': 'off',
      // `interface Props extends GlobalAnimation {}` 처럼 다른 타입 하나를 이름만 바꿔 쓰는 곳이 있다
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],
    },
  },

  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: { 'no-alert': 'off' },
  },

  // 포맷은 prettier 가 정한다. 다른 설정의 포맷 규칙을 끄도록 마지막에 둔다
  prettierRecommended,
  { rules: { 'prettier/prettier': ['error', { endOfLine: 'auto' }] } },
);
