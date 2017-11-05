/* eslint-disable */
module.exports = {
  scope: 'heinz',
  name: 'model name (plural form)',
  dependencies: ['router', 'viewEngine', 'Repo'],
  factory: function (router, viewEngine, Repo) {
    'use strict'

    var repo

    /**
     *
     * @param {*} input
     */
    function Model (input) {
      var self = {}
      input = input || {}

      self.id = input.id

      return self
    }

    /**
     *
     * @param {*} view
     */
    function ViewModel (view) {
      view = Object.assign({}, view)

      var self = {
        title: 'Model Name (plural)'
      }

      return self
    }

    /**
     * Repo (AJAX calls to the server)
     */
    repo = (function ApplicationRepo (Repo) {

    }(Repo))

    /**
     * Route binding (controller)
     */
    function registerRoutes () {

    }

    return {
      registerRoutes: registerRoutes
    }
  }
}
