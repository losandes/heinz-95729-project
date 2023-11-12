import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.serviceworker,
    },
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
  },
  settings: {
    react: {
      /**
       * React version. "detect" automatically picks the version
       * you have installed. You can also use `16.0`, `16.3`, etc,
       * if you want to override the detected value. It will default
       * to "latest" and warn if missing, and to "detect" in the future
       */
      version: 'detect',
    },
  },
}
