module.exports = {
  scope: 'heinz',
    name: 'ordersComponent',
    dependencies: ['Vue','orders'],
    factory: (Vue, orders) => {
    'use strict'

      let state = { orders: [] }

      const component = Vue.component('orders', {
      template: `
      < div class= "orders-component" >
      <div class="row">
          <div v-for="order in orders">
          <h3><b>Order id:  {{order.id}}</b></h3>
          <h3><b>Price:  {{order.price}} $</b></h3>
          <h3><b>Date:  {{order.date}}</b></h3>
          <div class= "products-component">
          <div class="row">
            <div v-for="product in order.products">
              <div class="col-sm-6 col-md-4 col-row">
                <div class="thumbnail">
                  <a class="thumbnail-img" href="javascript:void(0);">
                    <img :src="product.thumbnail_href" :alt="product.thumbnail_href">
                  </a>

                  <div class="caption">
                    <h3><a href="javascript:void(0);">{{product.title}}</a></h3>
                </div>
              </div>
            </div>

          </div>
        </div >
              

</div>
</div>`,
      data: () => {
        return state
      },
    })

      const setorders = (searchResults) => {
      state = searchResults
    }

      return { component, setorders }
  },
}
