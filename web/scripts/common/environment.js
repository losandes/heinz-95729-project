module.exports = {
  scope: 'heinz',
  name: 'environment',
  dependencies: ['location'],
  factory: function (location) {
    'use strict'

    const env = {
      apiOrigin: 'http://localhost:3000',
      defaultVersion: '20171101',
    }

    return {
      get: get,
      log: log,
    }

    function get (name) {
      const result = env[name]

      if (typeof result === 'undefined') {
        return null
      }

      return result
    }

    function log () {
      console.log(env)
    }
  },
}
