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
      <head>
     <h1 id="page">Shopping Cart</h1>
   </head>

  <div class="shopping-cart">
    <link href="_cart.less" rel="stylesheet" />

    <div cl ass="column-labels">
      <label class="product-image">Image</label>
      <label class="product-name">Book Name</label>
      <label class="product-price">Price</label>
      <label class="product-removal">Remove</label>
    </div>


    <div class="product">
      <div class="product-image">
        <img src="/images/books/beforeIGo.jpg">
      </div>
      <div class="product-name">
        <div class="product-title">book1</div>
      </div>
      <div class="product-price">12.99</div>
      <div class="product-removal">
        <button class="remove-product">
          Remove
        </button>
      </div>
    </div>

    <div class="product">
      <div class="product-image">
        <img src="/images/books/beforeIGo.jpg">
      </div>
      <div class="product-name">
        <div class="product-title">book1</div>
      </div>
      <div class="product-price">12.99</div>
      <div class="product-removal">
        <button class="remove-product">
          Remove
        </button>
      </div>
    </div>


    <div class="totals">
      <div class="totals-item">
        <label class="total">Subtotal</label>
        <div class="totals-value" id="cart-subtotal">71.97</div>
      </div>
      <div class="totals-item">
        <label class="total">Tax (5%)</label>
        <div class="totals-value" id="cart-tax">3.60</div>
      </div>
      <div class="totals-item">
        <label class="total111">Shipping</label>
        <div class="totals-value" id="cart-shipping">15.00</div>
      </div>
      <div class="totals-item totals-item-total">
        <label class="total">Grand Total</label>
        <div class="totals-value" id="cart-total">90.57</div>
      </div>
    </div>

    <button class="checkout">Checkout</button>

  </div>
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

