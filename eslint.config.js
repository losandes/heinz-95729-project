import functional from './configs/es/functional.js'
import standard from './configs/es/standard.js'
import react from './configs/es/react.js'
import ts from './configs/es/typescript.js'
import functionalOverrides from './configs/es/functional-overrides.js'
import standardOverrides from './configs/es/standard-overrides.js'
import reactOverrides from './configs/es/react-overrides.js'
import tsOverrides from './configs/es/typescript-overrides.js'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const files = [
  'src/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}',
]
const ignores = [] // if we change files to be more greedy we may need to add: '**/dist/', '**/node_modules',

export default [{
  /** DEFAULTS */
  files,
  ignores,
  languageOptions: {
    parser: ts.languageOptions.parser,
    parserOptions: {
      ecmaFeatures: { modules: true, jsx: true },
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['./tsconfig.json', './tsconfig.node.json'],
      tsconfigRootDir: __dirname,
    },
    globals: {
      ...react.languageOptions.globals,
      es2020: true,
    },
  },
  plugins: {
    ...functional.plugins,
    ...standard.plugins,
    ...react.plugins,
    ...ts.plugins,
  },
  rules: { // order matters, the overrides should be last
    ...standard.rules,
    ...ts.rules,
    ...react.rules,
    ...functional.rules,
    ...functionalOverrides.rules,
    ...standardOverrides.rules,
    ...reactOverrides.rules,
    ...tsOverrides.rules,
  },
  settings: {
    ...react.settings,
    'import/resolver': {
      'typescript': {
        '@domains': './src/domains',
        '@layouts': './src/layouts',
        '@lib': './src/lib',
        '@pages': './src/pages',
        '@env': 'src/lib/env/index.ts',
        '@logger': 'src/lib/logger/index.ts',
      }
    },
  },
}]
