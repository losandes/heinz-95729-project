module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    var state = {}
    const component = Vue.component('productsInCart', {
      template: `
        <div class="products-component cart-component">
          <div class="row">
            <div v-for="product in products">
              <div class="col-sm-6 col-md-4 product-col">
                <div class="thumbnail">
                  <a class="thumbnail-img" href="javascript:void(0);" v-on:click="product.viewDetails">
                    <img :src="product.thumbnailLink" :alt="product.thumbnailAlt">
                  </a>
                  <div class="caption">
                    <h3><a href="javascript:void(0);" v-on:click="product.viewDetails">{{product.title}}</a></h3>
                    <div class="description">{{product.description}}</div>
                    <div class="overlay"></div>
                    <div class="text-right">
                    <div class="quantityBtnGroup btn-group btn-group-sm" role="group" aria-label="choose quantity">
                    <button type="button" class="btn btn-success" v-on:click="product.decrement">-</button>
                    <button :id="product.uid" class="btn btn-success">{{product.quantity}}</button>
                    <button type="button" class="btn btn-success" v-on:click="product.increment">+</button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!-- /products -->
          </div><!-- /row -->
          <div class="row">
            <div class="col-sm-6 col-md-4 product-col">
            <button type="button" class="btn btn-success">Sub Total: {{subtotal}}$</button>
            <button type="button" class="btn btn-info" href="javascript:void(0);" v-on:click="checkout">Check Out</button>
            </div>
          </div><!-- /row -->
        </div><!-- /component -->`,
      data: () => {
        return state
      }
    })
    const updateSubtotal = () => {
      let sum = state.products.reduce((p1, p2) => p1.price * p1.quantity + p2.price * p2.quantity)
      state.subtotal = Math.round(sum * 100) / 100
    }

    const setProducts = (cart) => {
      console.log('inside cartComponents trying to set')
      console.log(cart)
      state = cart
      console.log(state)
      updateSubtotal()
    }

    return {component, updateSubtotal, setProducts}
  }
}

