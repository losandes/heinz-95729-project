import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default {
  languageOptions: {
    parser: tsParser,
  },
  plugins: {
    '@typescript-eslint': ts,
    ts,
  },
  rules: {
    ...ts.configs['strict-type-checked'].rules,
    ...ts.configs['stylistic-type-checked'].rules,
  },
}
