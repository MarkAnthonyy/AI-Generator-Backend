import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // 🚫 NEVER lint build output
  {
    ignores: ['dist/**'],
  },

  // base JS rules
  js.configs.recommended,

  // TypeScript config
  {
    files: ['**/*.ts'],

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },

      // Node.js globals (fixes "process is not defined")
      globals: globals.node,
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    rules: {
      // TS rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',

      // avoid duplicate base rule conflicts
      'no-unused-vars': 'off',

      'linebreak-style': 'off',
    },
  },

  prettierConfig,
];
