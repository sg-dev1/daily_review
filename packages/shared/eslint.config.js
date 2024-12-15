import { config } from '@repo/eslint-config/base';

const eslintConfig = [
  ...config,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // TODO: fixme - handling of environment variables together with turborepo
      'turbo/no-undeclared-env-vars': 'off',
    },
  },
];

/** @type {import("eslint").Linter.Config} */
export default eslintConfig;
