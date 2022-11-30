module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    let state = {};

    const component = Vue.component('cart', {
      template: `
        <h1 style="text-align: center; margin-top: 60px;">What a cart!</h1>`,
      data: () => {
        return state
      },
    })

    return { component }
  },
}
