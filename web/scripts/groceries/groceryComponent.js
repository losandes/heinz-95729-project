module.exports = {
  scope: 'heinz',
  name: 'groceryComponent',
  dependencies: ['Vue', 'Grocery'],
  factory: (Vue, Grocery) => {
    'use strict'

    var state = new Grocery()

    const component = Vue.component('grocery', {
      template: `
        <div class="book-component details">
          <figure class='grocery'>
                <img v-if="showThumbnail" :src="thumbnailLink" :alt="thumbnailAlt">
          </figure>
          <div class="grocery-details">
            <h1>{{title}}</h1>
              <div v-for="g in categories">
                <span>Aisle: {{g.aisle}}</span>
                <span>Department: {{g.department}}</span>
              </div>
              <div>{{description}}</div>
            <div class="purchase">
              <button class="btn btn-success btn-buy" v-on:click="addToCart">{{price}}</button>
            </div>
          </div>
        </div>`,
      data: () => {
        return state
      }
    })

    const setGrocery = (grocery) => {
      state = grocery
    }

    return { component, setGrocery }
  }
}

