module.exports = {
  scope: 'heinz',
  name: 'downloadComponent',
  dependencies: ['Vue', 'downloadRepo'],
  factory: (Vue, downloadRepo) => {
    'use strict'

    const state = {
      uid: null,
      order_id: null
    }

    const component = Vue.component('download', {
      template: `
        <div>
          <h2 id="download-message"> Download successful. Thank you for your purchase. </h2>
        </div>`,
    })

    return {
      component
    }
  }
}
