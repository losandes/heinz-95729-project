module.exports = {
  scope: 'heinz',
  name: 'userHistoryComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    var state = { products: [] }

    const component = Vue.component('history', {
      template: `
        <div class="history-component">
          <div class="row">
          <!-- TODO: ADD USER DETAILS -->
          <a href="/userproducts"> View History </a>
          </div><!-- /row -->
        </div><!-- /component -->`,
      data: () => {
        return state
      },
    })

    const setProducts = (searchResults) => {
      state = searchResults
    }

    return { component, setProducts }
  }
}
