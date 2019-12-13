module.exports = {
  scope: 'heinz',
  name: 'downloadComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    const component = Vue.component('download', {
      template: `
        <div>
          <h2 class="download-component" id="download-message"> Download successful. Thank you for your purchase. </h2>
        </div>`,
    })

    return {
      component
    }
  }
}
