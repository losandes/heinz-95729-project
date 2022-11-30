module.exports = {
  scope: 'heinz',
  name: 'bookComponent',
  dependencies: ['Vue', 'Book'],
  factory: (Vue, Book) => {
    'use strict'

    let state = new Book()

    const component = Vue.component('book', {
      template: `
        <div class="book-component details">
          <figure class='book'>
          <!-- Front -->
            <ul class='hardcover_front'>
              <li>
                <img v-if="showThumbnail" :src="thumbnailHref" :alt="thumbnailAlt">
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
            <!--
            <figcaption>
              <h1>{{title}}</h1>
              <div v-for="author in authors">
                <span>{{author.name}}</span>
              </div>
              <div>{{description}}</div>
            </figcaption>
            -->
          </figure>
          <div class="book-details">
            <h1>{{title}}</h1>
            <div v-for="author in authors">
              <span>{{author.name}}</span>
            </div>
            <div>{{description}}</div>
            <div class="purchase">
              <button class="btn btn-success btn-buy" v-on:click="addToCart">{{price}}</button>
            </div>
          </div>
        </div>`,
      data: () => {
        return state
      },
    })

    const setBook = (book) => {
      state = book
    }

    return { component, setBook }
  },
}
