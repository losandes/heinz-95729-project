export default {
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'no-void': ['error', { 'allowAsStatement': true }],    // allow void as statement for removing catch from fetch.resolve calls
    '@typescript-eslint/no-floating-promises': ['error', { // allow void as statement for removing catch from fetch.resolve calls
      ignoreVoid: true,
    }],
    '@typescript-eslint/no-redeclare': 'off',              // this rule doesn't support merging TS types with implementations
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      // 'varsIgnorePattern': '^_',                           // ignore unused variables starting with _
      'argsIgnorePattern': '^_',                           // ignore unused arguments starting with _
    }],
  },
}
