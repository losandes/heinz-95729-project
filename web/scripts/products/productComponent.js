module.exports = {
  scope: 'heinz',
  name: 'productComponent',
  dependencies: ['Vue', 'Product'],
  factory: (Vue, Product) => {
    'use strict'

    let state = new Product()

    const component = Vue.component('product', {
      template: `
        <div class="product-component details">
          <figure class='product'>
            <img :src="thumbnailHref" :alt="thumbnailAlt">
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
        return state
      },
    })

    const setProduct = (product) => {
      state = product
    }

    return { component, setProduct }
  },
}
