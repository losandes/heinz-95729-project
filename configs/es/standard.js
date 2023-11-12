import imprt from 'eslint-plugin-import' // 'import' is ambiguous & prettier has trouble
import n from 'eslint-plugin-n'
import espromise from 'eslint-plugin-promise'
import standard from 'eslint-config-standard'

export default {
  plugins: {
    import: imprt,
    n,
    promise: espromise,
  },
  rules: {
    ...standard.rules,                                                   // doesn't support merging TS types with implementations (also see ./typescript.js::@typescript-eslint/no-redeclare)
  },
}
