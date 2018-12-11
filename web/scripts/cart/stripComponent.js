module.exports = {
  scope: 'heinz',
  name: 'stripComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    var state = {}
    const component = Vue.component('strip', {
      template: `<button>Purchase</button>`,
      data: () => {
        return state
      }
    })
    return {component}
  }
}

