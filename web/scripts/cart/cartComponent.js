module.exports = {
    scope: 'heinz',
    name: 'cartComponent',
    dependencies: ['Vue', 'cart'],
    factory: (Vue, cart) => {
        'use strict'

        let state = { cart: [] }

        const component = Vue.component('cart', {
            template: `
      <div class= "cart-component">
       <div class="row">
        <b><h3>Total Price :{{cart[cart.length-1]}} $</h3></b>

        <div v-for="ct in cart">
          <h3><b>{{ct.title}}</b></h3>
          <h3><img :src="ct.thumbnail_href"/></h3>
          <h3><b>Price:  {{ct.price}} $</b></h3>
        </div>
       </div>
      </div>`,
            data: () => {
                return state
            },
        })

        const setcart = (searchResults) => {
            state = searchResults
        }

        return { component, setcart }
    },
}
