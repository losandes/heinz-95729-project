module.exports = {
  scope: 'heinz',
  name: 'stripeComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    var state = new Product()

    const component = Vue.component('product', {
      template: `
        <div>
          
        </div>`,
      data: () => {
        return state
      }
    })

    const setProduct = (product) => {
      state = product
    }

    return { component, setProduct }
  }
}

