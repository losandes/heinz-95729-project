module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['Vue', 'environment'],
  factory: (Vue, env) => {
    'use strict'

    let state = {
      products: []
    };

    const component = Vue.component('cart', {
      mounted: () => {
        // get added products from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        for (const key in cart) {
          state.products.push(cart[key]);
        }

        console.log(state.products);
      },
      template: `
          <div>
            <h3 style="text-align: center; margin-top: 60px;">{{ products.length }} Books in Cart</h3>
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
          // stripe.redirectToCheckout({sessionId: "cs_test_a1eJ2LY0R3HwoQbsyYNA8IwGqSjGO83z6QTUcpBZeL7bk1SPEODa0hSiyI"})
          window.location.href = "https://buy.stripe.com/test_eVa14l3XMeaF2l2000";

          // const session = await stripe.checkout.sessions.create({
          //   line_items: [
          //     {
          //       // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          //       price: 'pr_1234',
          //       quantity: 1,
          //     },
          //   ],
          //   mode: 'payment',
          //   success_url: 'http://localhost:3001/checkout/success',
          //   cancel_url: 'http://localhost:3001/checkout/cancel',
          // });
        
          // res.redirect(303, session.url);
        },
        
      }
    })

    return { component }
  },
}
