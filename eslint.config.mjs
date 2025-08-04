import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  ...tseslint.configs.recommended,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}', 'dist/**', 'node_modules/**'] },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Turn off base rule as it can report incorrect errors
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Allow any types for flexibility
      '@typescript-eslint/no-empty-object-type': 'off', // Allow empty object types for flexibility
      '@typescript-eslint/ban-ts-comment': 'off', // Allow ts-ignore comments for flexibility
      '@typescript-eslint/no-require-imports': 'off', // Allow require() imports for flexibility in tests
    },
  }
);
