module.exports = {
  scope: 'heinz',
  name: 'productsComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    let state = { products: [] }

    const component = Vue.component('products', {
      template: `
        <div class="products-component">
          <div class="row">
            <div v-for="product in products">
              <div class="col-sm-6 col-md-4 product-col">
                <div class="thumbnail">
                  <a class="thumbnail-img" href="javascript:void(0);" v-on:click="product.viewDetails">
                    <img :src="product.thumbnailHref" :alt="product.thumbnailAlt">
                  </a>

                  <div class="caption">
                    <h3><a href="javascript:void(0);" v-on:click="product.viewDetails">{{product.title}}</a></h3>
                    <div class="description">{{product.description}}</div>
                    <div class="overlay"></div>
                    <a class="buy-now" href="javascript:void(0);" v-on:click="product.addToCart">{{product.price}}</a>
                  </div>
                </div>
              </div>
            </div> <!-- /products -->
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
  },
}
