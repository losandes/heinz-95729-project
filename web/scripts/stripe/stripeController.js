module.exports = {
  scope: 'heinz',
  name: 'stripeController',
  dependencies: ['router', 'stripeRepo', 'storage', 'stripeComponent'],
  factory: (router, repo, storage, stripeComponent) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes(app) {
      router('/stripe/:amt', (context) => {

        if (storage.exists('jwt')) {
          var amt = {
            amt: context.params.amt
          }
          stripeComponent.setAmt(amt)
          app.currentView = 'stripe'
        }
        else{
          app.currentView = 'login'
        }

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
          }, 5000)

        })

      })
    }

    return {
      registerRoutes
    }
  }
}
