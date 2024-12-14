import { config } from '@repo/eslint-config/base';

const eslintConfig = [
  ...config,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

/** @type {import("eslint").Linter.Config} */
export default eslintConfig;
