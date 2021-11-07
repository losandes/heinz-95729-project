/* global hilary */
(function (window, hilary) {
  'use strict'

  const newModule = {}
  const log = console.warn || console.log
  const warn = (err) => {
    log(err.message, err)
  }

  if (typeof module !== 'undefined' || typeof window === 'undefined' || !hilary) {
    throw new Error('Could not register hilary\'s module.exports')
  }

  Object.defineProperty(newModule, 'exports', {
    get: function () {
      return null
    },
    set: function (val) {
      if (!val) {
        return
      }

      val.scope = val.scope || 'heinz'
      hilary.scope(val.scope).register(val)
    },
    enumerable: true,
    configurable: false,
  })

  Object.defineProperty(window, 'module', {
    get: function () {
      return newModule
    },
    set: function () {
      const err = new Error('module (as in module.exports) is read only. You probably have two libraries that are trying to set module, on window.')
      warn(err)
      return err
    },
    enumerable: true,
    configurable: false,
  })
}(window, hilary))
