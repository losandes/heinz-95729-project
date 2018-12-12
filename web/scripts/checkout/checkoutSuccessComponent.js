module.exports = {
  scope: 'heinz',
  name: 'checkoutSuccessComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    const component = Vue.component('checkoutSuccess', {
      template: `
        <div class="success-component">
          <h1>Your order has been successfully processed!</h1>
          <h3>Please go to your profile page to view books you've bought</h3>
        </div>`
    })

    return { component }
  }
}

