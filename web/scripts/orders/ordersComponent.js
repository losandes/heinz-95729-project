module.exports = {
  scope: 'heinz',
  name: 'ordersComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'
   
    var products = {  }

    const component = Vue.component('orders', {
      template: `
        <div class='history-component'>
        <table class='table table-dark .table-bordered'>
          <thead class='thead-info'>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody v-for="(product, p_index) in products" class="product-panel">
           
            <tr v-for="(order_item, index) in product.items">

              <td v-bind:rowspan="product.items.length" v-if=" index == 0"> {{ p_index + 1 }} </td>
              <td> {{ new Date(product.created).toLocaleDateString() }} </td>
              <td> {{ order_item.name }} </td>
              <td> {{ order_item.quantity }} </td>
              <td> USD {{ order_item.price }} </td>
              <td> USD {{ (order_item.price * order_item.quantity).toFixed(2) }} </td>
            </tr>
            <tr><td colspan='6' align='right'><b>Total: USD {{product.total}}</b></td></tr>
           
          </tbody>
        </table>
        </div>
        
        `,
      data: () => {
        return { products }
      },
    })

    const setProducts = (searchResults) => {
      products = searchResults
    }

    return { component, setProducts }
  }
}
