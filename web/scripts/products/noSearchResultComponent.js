module.exports = {
  scope: 'heinz',
  name: 'noSearchResultComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    var state = {}

    const component = Vue.component('noSearchResult', {
      template: `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Woops!</strong> No Books Found...
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>`,
      data: () => {
        return state
      }
    })

    return {component}
  }
}

