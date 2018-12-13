module.exports = {
  scope: 'heinz',
  name: 'environment',
  dependencies: ['location'],
  factory: function (location) {
    'use strict'

    const env = {
      apiOrigin: 'http://localhost:3000',
      defaultVersion: '20171101',
      stripe_pk: 'pk_test_Lz1JhxYc3eAnK4P3Sc8kQHsh'
    }

    return {
      get: get,
      log: log
    }

    function get (name) {
      var result = env[name]

      if (typeof result === 'undefined') {
        return null
      }

      return result
    }

    function log () {
      console.log(env)
    }
  }
}
