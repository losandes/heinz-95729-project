module.exports = {
  scope: 'heinz',
  name: 'stripeController',
  dependencies: ['router','stripeRepo', 'storage'],
  factory: (router, repo, storage) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/stripe', () => {
        app.currentView = 'stripe'
      })

      router('/success', () => {
        repo.post(storage.get('user')._id, (err, product) => {
          if (err) {
            alert(err)
            router.navigate('/error')
          }

          setTimeout(() => {
            var video = document.getElementsByTagName("video")[0];
            video.style.display = 'block';
            var header = document.getElementsByTagName("header")[0];
            header.style.display = 'block';
            router.navigate('/')
          },5000)

        })

      })
    }

    return { registerRoutes }
  }
}
