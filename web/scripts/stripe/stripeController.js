module.exports = {
  scope: 'heinz',
  name: 'stripeController',
  dependencies: ['router', 'stripeRepo', 'storage', 'stripeComponent', 'localStorage'],
  factory: (router, repo, storage, stripeComponent, localStorage) => {
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
          alert('You must be logged in to checkout!')
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

          localStorage.removeItem('localCart')
          localStorage.removeItem('totalPrice')
          storage.remove('localCart')
          storage.remove('totalPrice')

        })

      })
    }

    return {
      registerRoutes
    }
  }
}
