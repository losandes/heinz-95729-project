module.exports = {
  scope: 'heinz',
  name: 'bookComponent',
  dependencies: ['Vue', 'Book', 'environment'],
  factory: (Vue, Book, env) => {
    'use strict'

    let state = new Book()
    const apiRoute = `${env.get('apiOrigin')}/reviews/${state.uid}`
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

          <div v-if="reviews.length">
            <h4>Reviews</h4>
            <div v-for="review in reviews">
              <div>{{review.description}}</div>
              <div>{{review.rating}}</div>
            </div>
            <div>Average Rating: {{avgRating}}</div>
          </div>


        </div>`,
      data: () => {
        return state
      },
      computed: {
        avgRating: function () {
          let sum = 0
          let count = 0
          if (this.reviews.length) {
            this.reviews.forEach(element => {
              sum += parseInt(element.rating)
              count++
            })
            return (sum / count)
          } else {
            return 0
          }
        },
      },
    })

    const setBook = (book) => {
      state = book
    }

    const setReviews = (reviews) => {
      state.reviews = reviews
    }

    return { component, setBook, setReviews }
  },
}
