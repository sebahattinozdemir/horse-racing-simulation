import globals from 'globals';
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';

export default [
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        sourceType: 'module',
        ecmaVersion: 2022,
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      vue
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off'
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'public/', '*.d.ts'],
  },
]; 