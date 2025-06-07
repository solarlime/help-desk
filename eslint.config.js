import js from '@eslint/js';
import globals from 'globals';
import { configs as tsEslintConfigs } from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';

export default defineConfig([
  tsEslintConfigs.recommended,
  {
    ignores: ['dist', '.yarn', 'node_modules'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
      react,
      'import-x': importX,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    extends: [
      'js/recommended',
      'import-x/flat/recommended',
      'import-x/flat/typescript',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '19' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-undef': 'warn',
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      'import-x/no-unresolved': ['error', { ignore: ['\\.svg\\?react$'] }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
  eslintConfigPrettier,
]);
