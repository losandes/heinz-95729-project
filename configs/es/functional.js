import functional from 'eslint-plugin-functional'

export default {
  plugins: {
    functional,
  },
  rules: {
    ...functional.configs['external-vanilla-recommended'].rules,
    ...functional.configs.recommended.rules,
    ...functional.configs.stylistic.rules,
  },
}
