import { createI18n } from 'vue-i18n'
import logger from './logger.js'
import en from './i18n/en.js'
import ja from './i18n/ja.js'

let i18nSingleton

export const i18n = () => {
  if (i18nSingleton) {
    return i18nSingleton
  } else {
    logger.emit('creating_i18n', 'trace')
    i18nSingleton = createI18n({
      locale: 'en', //if you need get the browser language use following "window.navigator.language"
      fallbackLocale: 'ja',
      allowComposition: true,
      messages: { en, ja }
    })

    return i18nSingleton
  }
}

export default i18n

/**
 *
 * @param {*} key
 * @returns
 */
export const translate = (key) => {
  if (!key) {
    return ''
  }

  return i18n().global.t(key)
}
