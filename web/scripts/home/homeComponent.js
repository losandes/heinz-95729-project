module.exports = {
  scope: 'heinz',
  name: 'homeComponent',
  dependencies: ['Vue', 'locale'],
  factory: (Vue, locale) => {
    'use strict'

    const component = Vue.component('home', {
      template: `
        <div class="component empty-component home">
         <image src="/images/paypr.png" class="center-block logo"></image>
        </div>`,
      data: () => {
        return {
          heading: locale.pages.home.heading,
          body: locale.pages.home.body
        }
      }
    })

    return {
      component
    }
  }
}
