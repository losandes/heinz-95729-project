module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['Vue', 'environment'],
  factory: (Vue, env) => {
    'use strict'

    let state = {
      productCount: 0
    };

    const component = Vue.component('cart', {
      template: `
          <div>
            <h1 style="text-align: center; margin-top: 60px;">What a Cart!</h1>
            <h3 style="text-align: center; margin-top: 60px;">{{productCount}} Books in Cart</h3>
            <br />
            <button class="btn btn-success" v-on:click="checkout">Checkout</button>
          </div>  
        `,
      data: () => {
        return state
      },
      methods: {
        checkout: async () => {
          console.log("Checkout...")
          
          const stripe = Stripe(env.get('STRIPE_SECRET'))
          const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: 'pr_1234',
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3001/checkout/success',
            cancel_url: 'http://localhost:3001/checkout/cancel',
          });
        
          res.redirect(303, session.url);
        }
      }
    })

    return { component }
  },
}
