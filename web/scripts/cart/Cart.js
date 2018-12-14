module.exports = {
  scope: 'heinz',
  name: 'Cart',
  dependencies: ['router', 'storage', 'cartRepo'],
  factory: (router, storage, repo) => {
    'use strict'

    return function Cart (ps) {
      const self = {
        products: ps,
        subtotal: ps.reduce((p1, p2) => p1.price * p1.quantity + p2.price * p2.quantity),
        email: storage.get('user').email
      }
      self.pay = () => {
        var handler = StripeCheckout.configure({
          key: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
          image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
          locale: 'auto',
          token: function (token) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log('on success')

            let readyToPay = self.products.filter(p => p.quantity > 0)
            if(readyToPay.length === 0) {
              router.navigate('/')
              return
            }
            let productsAndToken = JSON.stringify({ps: readyToPay.map(p => p.uid), tid: token.id})
            console.log(productsAndToken)
            router.navigate(`/paymentToServer/${productsAndToken}`)
          }
        })
        handler.open({
          name: 'Pay By Stripe',
          description: String(self.products.map(p => p.quantity).reduce((q1, q2) => q1 + q2)).concat(' Books'),
          zipCode: false,
          amount: self.subtotal * 100
        })

        // Close Checkout on page navigation:
        window.addEventListener('popstate', function () {
          handler.close()
        })
      }
      return self
    }
  }
}
