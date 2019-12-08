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
          router.navigate('/history')
          app.currentView = 'home'
        }else{
          app.currentView = 'login'
        }
      })

      router('/register', () => {
        app.currentView = 'register'
      })

      router('/history', () => {

        repo.history(storage.get('user')._id, (err, products) => {
          if (err) {
            alert(err)
          }

          if (products && products.length) {
            //TODO: once there are orders
            router.naviagte('/userproducts')
            console.log('successful')
          } else {
            console.log('no orders')
            router.navigate('/error')
          }
        })

      })
    }

    return { registerRoutes }
  }
}
