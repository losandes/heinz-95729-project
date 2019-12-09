module.exports = {
  scope: 'heinz',
  name: 'userHistoryComponent',
  dependencies: ['Vue', 'storage','router'],
  factory: (Vue, storage, router) => {
    'use strict'

    var state = { products: [] }

    const component = Vue.component('history', {
      template: `
        <div class="history-component">
          <div class="row">
          <!-- TODO: ADD USER DETAILS -->
          <a href="/userproducts"> View History </a>
          <button class="btn btn-success" v-on:click="logout">Log out</button>
          </div><!-- /row -->
        </div><!-- /component -->`,
      data: () => {
        return state
      },
      methods: {
        logout: function (event) {
          storage.remove('jwt')
          storage.remove('user')
          return router.navigate('/login')
        }
      }
    })

    const setProducts = (searchResults) => {
      state = searchResults
    }

    return { component, setProducts }
  }
}
