module.exports = {
  scope: 'heinz',
  name: 'bookComponent',
  dependencies: ['Vue', 'Book', 'environment', 'booksRepo'],
  factory: (Vue, Book, env, repo) => {
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
            <h4 v-if="reviews.length">Average Rating: {{avgRating}}</h4>
            <div class="purchase">
              \${{price}}
              <a class="add-cart btn btn-success btn-buy" href="javascript:void(0);" v-on:click="addToCart">Add to cart</a>
            
            </div>
          </div>
          <div :style="{display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-around', 'margin-top': '75px'}">
            <div v-if="reviews.length" :style="{width: '516px'}">
              <h3>Reviews</h3>
              <div :style="{display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-around', 'margin-top': '25px'}">
                <div v-for="review in reviews">
                  <div :style="{border: '1px solid grey', background: 'lightgray', padding: '5px', 'border-radius': '5px'}">{{review.description}}</div>
                </div>
              </div>
            </div>

            <div :style="{width: '516px'}">
              <h3>Add a review</h3>
                  <div class="form-group" :style="{'margin-top': '25px'}">
                    <label for="review-description">Description</label>
                    <input v-model="reviewDescription" name="description" class="form-control" id="review-description" placeholder="Good product" />
                    <label for="review-rating">Rating</label>
                    <input v-model="reviewRating" name="rating" class="form-control" id="review-rating" placeholder="1" />
                  </div>
                  <button class="btn btn-success" v-on:click="createReview">Submit</button>
            </div>
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
            let avg = sum / count
            return avg.toFixed(2)
          } else {
            return 0
          }
        },
      },
      methods: {
        createReview: (event) => {
          repo.addReview(state.reviewDescription, state.reviewRating, state.uid, (err, response) => {
            if (err) console.log(err)
            else {
              console.log(response)
              alert("Review has been added")
              window.location.reload()
            }
          })
        },
      },
    })

    const setBook = (book) => {
      state = book
      state.reviewDescription = ''
      state.reviewRating = ''
    }

    const setReviews = (reviews) => {
      state.reviews = reviews
    }

    return { component, setBook, setReviews }
  },
}


{/* <button class="add-cart btn btn-success btn-buy" v-on:click="addToCart">Add to cart</button> */}
