module.exports = {
  scope: 'heinz',
  name: 'productComponent',
  dependencies: ['Vue', 'Product'],
  factory: (Vue, Product) => {
    'use strict'

    var state = new Product()

    const component = Vue.component('product', {
      template: `
        <div class="book-component details">
          <figure class='book'>
          <!-- Front -->
            <ul class='hardcover_front'>
              <li>
                <img v-if="showThumbnail" :src="thumbnailLink" :alt="thumbnailAlt">
                <div v-else class="coverDesign yellow"></div>
              </li>
              <li></li>
            </ul>
          <!-- Pages -->
            <ul class='page'>
              <li></li>
              <li>
                <a class="btn" :href="detailsLink">READ MORE</a>
              </li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          <!-- Back -->
            <ul class='hardcover_back'>
              <li></li>
              <li></li>
            </ul>
            <ul class='book_spine'>
              <li></li>
              <li></li>
            </ul>
            <figcaption>
              <h1>{{title}}</h1>
              <div v-for="author in authors">
                <span>{{author.name}}</span>
              </div>
              <div>{{description}}</div>
            </figcaption>
          </figure>
          <div class="purchase">
            <button class="btn btn-success btn-buy" v-on:click="addToCart">{{price}}</button>
          </div>
        </div>`,
      data: () => {
        return state
      }
    })

    const setProduct = (product) => {
      state = product
    }

    return { component, setProduct }
  }
}

