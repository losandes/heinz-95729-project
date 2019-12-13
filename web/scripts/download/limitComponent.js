module.exports = {
  scope: 'heinz',
  name: 'limitComponent',
  dependencies: ['Vue'],
  factory: (Vue) => {
    'use strict'

    const component = Vue.component('limit', {
      template: `
        <div>
          <h2 class="download-component" id="download-message"> You have downloaded the copies of PDF you have purchased. Please purchase more if you want to download more copies. </h2>
        </div>`,
    })

    return {
      component
    }
  }
}
