module.exports = {
  scope: 'heinz',
  name: 'checkoutComponent',
  dependencies: ['Vue', 'ShoppingCart', 'router', 'storage', 'checkoutRepo', 'Checkout'],
  factory: (Vue, shoppingCart, router, storage, checkoutRepo, Checkout) => {
    'use strict'

    let state = { products: [], subtotal: 0.0, shoppingCart, stripe: {} }
    let card = 'invalid'
    let message = {}

    const component = Vue.component('checkout', {
      template: `
        <div class="products-component">
          <div class="row">
            <div v-for="product in products">
              <div class="col-sm-6 col-md-4 product-col">
                <div class="thumbnail">
                  <a class="thumbnail-img" href="javascript:void(0);" v-on:click="product.viewDetails">
                    <img :src="product.thumbnailLink" :alt="product.thumbnailAlt">
                  </a>
                  <div class="caption">
                    <h3>{{product.title}}</h3>
                    <div class="description">
                      <div class="price"><strong>\${{product.price}}</strong></div> <br>
                      <a href="javascript:void(0);" v-on:click="shoppingCart.removeItem(product);
                        subtotal = shoppingCart.getSubtotal()">
                        <button type="button" class="btn btn-danger">Remove</button>
                      </a>
                    </div>
                    <!-- <div class="overlay"></div> -->
                  </div>
                </div>
              </div>
            </div> <!-- /products -->
          </div><!-- /row -->
          <div class="subtotal">
            <h2>Subtotal: \${{subtotal}}</h2>
          </div>
          <div class="checkout" v-if="products.length > 0">
            <br>
            <form action="/charge" method="post" id="payment-form">
              <div class="form-row">
                <label for="card-element">
                  Credit or debit card
                </label>
                <div id="card-element">
                  <!-- A Stripe Element will be inserted here. -->
                </div>
                <!-- Used to display Element errors. -->
                <div id="card-errors" role="alert"></div>
              </div>
              <br>
              <button class="btn btn-primary">Submit Payment</button>
            </form>
          </div>
          <div class="emptyCart" v-else><h2>Your cart is empty</h2></div>
        </div><!-- /component -->`,
      data: () => {
        return state
      },
      mounted: () => {
        if (state.products.length > 0) {
          // Create stripe card input.
          card = state.stripe.elements().create('card')
          card.mount('#card-element')
          // Add event listener for input errors in real time.
          const displayError = document.getElementById('card-errors')
          message = displayError
          card.addEventListener('change', function (event) {
            if (event.error) {
              displayError.textContent = event.error.message
            } else {
              displayError.textContent = ''
            }
          })
          // Add event listener to handle payment processing with stripe.
          const form = document.getElementById('payment-form')
          form.addEventListener('submit', function (event) {
            event.preventDefault()
            if (storage.get('user')) {
              createToken()
            } else {
              displayError.textContent = 'Please login to complete your purchase'
            }
          })
        }
      }
    })

    function createToken () {
      state.stripe.createToken(card).then(function (result) {
        if (result.error) {
          // Inform the customer that there was an error.
          var errorElement = document.getElementById('card-errors')
          errorElement.textContent = result.error.message
        } else {
          // Send the token to the server.
          const checkout = new Checkout({
            email: storage.get('user').email,
            tokenID: result.token.id,
            total: state.subtotal,
            products: state.products
          })
          checkoutRepo.charge(checkout, (err, res) => {
            if (err) {
              console.log(err)
              console.log('Charge failed')
              return
            }

            // Empty the shopping cart.
            while (shoppingCart.getItems().length !== 0) {
              shoppingCart.removeItem(state.products[0])
            }
            router.navigate('/checkout-success')
          })
          message.textContent = 'Please wait while we process your order'
          // TODO: Are we allowing user to download a fake e-book?
          // If so, this can be done from user profile.
          // Should we add tax?
        }
      })
    }

    const setCheckout = (cart) => {
      state = cart
    }

    return { component, setCheckout }
  }
}
