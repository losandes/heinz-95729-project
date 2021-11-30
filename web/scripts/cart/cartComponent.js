module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['environment', 'Vue'],
  factory: (environment, Vue) => {
    'use strict'

    let state = { products: [] }
    
    const component = Vue.component('checkout', {
      template: `<div class = "products-container">
        <div class="product-header">
            <h5 class="product-title">PRODUCT</h5>
            <h5 class="product-price">PRICE</h5>
            <h5 class="product-quantity">QUANTITY</h5>
            <h5 class="product-total">TOTAL</h5>
        </div>
        <div class = "products">
            TEST
        </div>
    </div>`
      ,
      data: function () {
        return state
      },
    })

    return { component }
  },
}
