module.exports = {
  scope: 'heinz',
  name: 'homeComponent',
  dependencies: ['Vue', 'locale', 'productsComponent', 'storage'],
  factory: (Vue, locale, productsComponent, storage) => {
    'use strict'
    var state = { products: [] }

    const component = Vue.component('home', {
      template: `
        <!--div class="component empty-component">
          <h1>{{heading}}</h1>
          <div>{{body}}</div-->
        </div>
        <div class="product-component details">
          <figure class='product'>
            <img :src="thumbnailLink" :alt="thumbnailAlt">
            <figcaption>
              <h1>{{title}}</h1>
              <div>{{description}}</div>
            </figcaption>
          </figure>
          <div class="purchase">
            <button class="btn btn-success btn-buy" v-on:click="addToCart">{{price}}</button>
          </div>
        </div>`,
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
