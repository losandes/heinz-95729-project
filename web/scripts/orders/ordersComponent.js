module.exports = {
  scope: 'heinz',
  name: 'ordersComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    var state = { products: [] }

    const component = Vue.component('orders', {
      template: `
        <div class="orders-component">
          <div class="row text-center">
          <div v-for="product in products" class="product-panel">
          <label><h3>{{product.name}}&nbsp;</h3></label>
          <label><h3><span class="label-name">Qty:</span> {{product.quantity}}&nbsp;</h3></label>
          <label><h3><span class="label-name">Price:</span> {{product.price}}</h3></label>
          </div>
          </div><!-- /row -->
        </div><!-- /component -->`,
      data: () => {
        return state
      },
    })

    const setProducts = (searchResults) => {
      state = searchResults
    }

    return { component, setProducts }
  }
}
