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
        beforeMount() {
          var video = document.getElementsByTagName("video")[0];
          video.style.display = 'block';
          var header = document.getElementsByTagName("header")[0];
          header.style.display = 'block';
        },
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
