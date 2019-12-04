module.exports = {
  scope: 'heinz',
  name: 'errorComponent',
  dependencies: ['Vue', 'locale'],
  factory: (Vue, locale) => {
    'use strict'

    const component = Vue.component('error', {
      template: `
        <div class="component empty-component error text-center">
        {{message}}
        </div>`,
      data: () => {
        return {
          message: locale.errors.generic,
        }
      }
    })

    return {
      component
    }
  }
}
