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

      self.checkout = () => {
        console.log(`TODO: checkout`)
        console.log('subtotal: '.concat(self.subtotal))
        console.log('email: '.concat(self.email))
        console.log(self.products)
        console.log(`TODO: checkout`)
        repo.checkout(self, (err, success) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }
          console.log('inside repo get ')
          console.log(success)
          
          
        })
      }
      self.pay = () => {
        var handler = StripeCheckout.configure({
          key: 'pk_test_dn2mCicRzdaZ41UcglnzcKTM',
          image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
          locale: 'auto',
          token: function (token) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log('on success')
            console.log(token.id)
            // TODO: send to server
            
            var stripe = require("stripe")("sk_test_9U82ExCWLf6XdmmiPI4Ilj8S");
            const charge = stripe.charges.create({
              amount: 999,
              currency: 'usd',
              description: 'Example charge',
              source: "tok_mastercard",
            });
            
          }
        })
        console.log('in side cart.pay')
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

        //router.navigate('/pay')
      }


      return self
    }
  }
}
