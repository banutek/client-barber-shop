import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintReact from '@eslint-react/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
import unicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.yarn', '*.log']),

  // ── Base config for all TS/TSX files ──
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintReact.configs.recommended,
      perfectionist.configs['recommended-natural'],
      unicorn.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // ── Perfectionist (sorting) ──
      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
          groups: [
            'builtin',
            'external',
            ['internal', 'parent', 'sibling', 'index'],
            'type',
            'unknown',
          ],
          newlinesBetween: 'ignore',
        },
      ],
      'perfectionist/sort-named-imports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-exports': ['warn', { type: 'natural', order: 'asc' }],

      // ── TypeScript ──
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // ── Unicorn ──
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/name-replacements': 'off',

      // ── General ──
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      curly: ['error', 'all'],
      'object-shorthand': ['error', 'always'],
    },
  },

  // ── Prettier (must be last to override other formatting rules) ──
  eslintPluginPrettierRecommended,
])
