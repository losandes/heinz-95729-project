module.exports = {
  scope: 'heinz',
  name: 'cartComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    //const state = { total: '' }

    const component = Vue.component('checkout', {
      template: `
      <h1>Hello</h1>
      `,
      // data: () => {
      //   return null;
      // }
    })

    return { component }
  }
}