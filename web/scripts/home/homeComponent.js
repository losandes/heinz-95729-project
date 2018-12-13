module.exports = {
  scope: 'heinz',
  name: 'homeComponent',
  dependencies: ['Vue', 'locale'],
  factory: (Vue, locale) => {
    'use strict'

    var state = { products: [], category: null }

    const component = Vue.component('home', {
      template: `
      <div class="component empty-component" v-if="state.products.length == 0">
        <div class="component empty-component">
          <h1>{{heading}}</h1>
          <div>{{body}}</div>
        </div>
      </div>
      <div class="products-component" v-else>
        <h2>{{state.category}}</h2>
        <div class="row">
          <div v-for="product in state.products">
            <div class="col-sm-6 col-md-4 product-col">
              <div class="thumbnail">
                <a class="thumbnail-img" href="javascript:void(0);" v-on:click="product.viewDetails">
                  <img :src="product.thumbnailLink" :alt="product.thumbnailAlt">
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
        return {
          heading: locale.pages.home.heading,
          body: locale.pages.home.body,
          state
        }
      }
    })

    const setProducts = (searchResults) => {
      state = searchResults
    }

    return { component, setProducts }
  }
}
