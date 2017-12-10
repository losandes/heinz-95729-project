module.exports = {
  scope: 'heinz',
  name: 'groceryComponent',
  dependencies: ['Vue', 'Grocery'],
  factory: (Vue, Grocery) => {
    'use strict'

    var state = {
      grocery: new Grocery(),
      recommendations: [],
      cartReco: []
    }

    const component = Vue.component('grocery', {
      template: `
      <div>
        <div class="book-component details">
          <figure class='grocery'>
                <img v-if="grocery.showThumbnail" :src="grocery.thumbnailLink" :alt="grocery.thumbnailAlt">
          </figure>
          <div class="grocery-details">
            <h1>{{grocery.title}}</h1>
              <div v-for="g in grocery.categories">
                <span>Aisle: {{g.aisle}}</span>
                <span>Department: {{g.department}}</span>
              </div>
              <div>{{grocery.description}}</div>
            <div class="purchase">
              <button class="btn btn-success btn-buy" v-on:click="grocery.addToCart">{{grocery.price}}</button>
            </div>
          </div>
          </div>
          <br>
          <div>
          <h3>People buy {{grocery.title}} also buy: </h3>
          <div id="recommendation" class="reco-inline">
            <div v-for="r in recommendations">
              <figure class='reco-grocery'>
                <a href="javascript:void(0);" v-on:click="r.viewDetails">
                  <img v-if="r.showThumbnail" :src="r.thumbnailLink" :alt="r.thumbnailAlt" v-on:click="r.viewDetails">
                  <h5 class="reco-label">{{r.title}}</h5>
                </a>
              </figure>
            </div>
          </div>
          </div>
        </div>`,
      data: () => {
        return state
      }
    })

    const setGrocery = (grocery) => {
      state.grocery = grocery
    }

    const setRecommendation = (reco) => {
      state.recommendations = reco
    }

    const setCartRecommendation = (cartReco) => {
      state.cartReco = cartReco
    }

    return {
      component,
      setGrocery,
      setRecommendation,
      setCartRecommendation
    }
  }
}