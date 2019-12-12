module.exports = {
  scope: 'heinz',
  name: 'usersController',
  dependencies: ['router', 'storage', 'usersRepo', 'userHistoryComponent'],
  factory: (router, storage, repo, userHistoryComponent) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/login', () => {
        if (storage.exists('jwt')) {
          var user = { name: storage.get('user').name, email: storage.get('user').email }
          userHistoryComponent.setUser(user)
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
