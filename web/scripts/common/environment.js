module.exports = {
  scope: 'heinz',
  name: 'environment',
  dependencies: ['location'],
  factory: function (location) {
    'use strict'

    const env = {
      apiOrigin: 'http://localhost:3000',
      defaultVersion: '20171101',
      STRIPE_SECRET: 'pk_test_51M9MzKF6BHfkbSANfan1MufsuQo81teadb2pdYVIB7swZY6SpH3YlZrOM8cIQJITWQ4mcuPhNruGoX63EUDSdTWh00MhhXHNfs'
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
