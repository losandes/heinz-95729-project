module.exports = {
  scope: 'heinz',
  name: 'homeComponent',
  dependencies: ['Vue', 'locale'],
  factory: (Vue, locale) => {
    'use strict'

    var state = { customCategories: [] }

    const component = Vue.component('home', {
      template: `
      <div class="component empty-component" v-if="state.customCategories.length == 0">
        <div class="component empty-component">
          <h1>{{heading}}</h1>
          <div>{{body}}</div>
        </div>
      </div>
      <div v-else>
        <div class="products-component" v-for="cat in state.customCategories">
          <h2>{{cat.category}}</h2>
          <div class="row">
            <div v-for="product in cat.products">
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
        </div><!-- /component -->
      </div><!-- /else display -->`,
      data: () => {
        return {
          heading: locale.pages.home.heading,
          body: locale.pages.home.body,
          state
        }
      }
    })

    const setProducts = (customCategories) => {
      state.customCategories = customCategories
      console.log(state.customCategories)
    }

    return { component, setProducts }
  }
}
