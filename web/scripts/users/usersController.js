module.exports = {
  scope: 'heinz',
  name: 'usersController',
  dependencies: ['router', 'loginComponent', 'registrationComponent'],
  factory: (router, loginComponent, registrationComponent) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/login', () => {
        app.currentView = 'login'
      })

      router('/register', () => {
        app.currentView = 'register'
      })
    }

    return { registerRoutes }
  }
}
