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
          <div class="row">
          <div v-for="product in products">
          <label>{{product.name}}</label>
          <label>{{product.quantity}}</label>
          <label>{{product.price}}</label>
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
