module.exports = {
  scope: 'heinz',
  name: 'checkoutComponent',
  dependencies: ['Vue', 'ShoppingCart'],
  factory: (Vue, shoppingCart) => {
    'use strict'

    var state = { products: [], subtotal: 0.0, shoppingCart }

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
          <div class="checkoutButton" v-if="products.length > 0">
            <a href="/purchase"><button type="button" class="btn btn-primary">Proceed to Purchase</button></a>
          </div>
          <div class="emptyCart" v-else><h2>Your cart is empty</h2></div>
        </div><!-- /component -->`,
      data: () => {
        return state
      }
    })

    const setCheckout = (cart) => {
      state = cart
    }

    return { component, setCheckout }
  }
}
