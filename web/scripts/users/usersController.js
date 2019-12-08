module.exports = {
  scope: 'heinz',
  name: 'usersController',
  dependencies: ['router', 'storage', 'usersRepo'],
  factory: (router, storage, repo) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/login', () => {
        if (storage.exists('jwt')) {
          app.currentView = 'history'
        }else{
          app.currentView = 'login'
        }
      })

      router('/register', () => {
        app.currentView = 'register'
      })

    }

    return { registerRoutes }
  }
}
