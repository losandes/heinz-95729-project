module.exports = {
  name: 'homeComponent',
  dependencies: ['router', 'viewEngine', 'locale'],
  factory: function (router, viewEngine, locale) {
    'use strict'

    const template = `
<div class="component empty-component">
  <h1>{{heading}}</h1>
  <div>{{body}}</div>
</div>`

    /**
     * The Home ViewModel / Component
     * @param {Object} view
     */
    function HomeViewModel (view) {
      view = Object.assign({}, view)

      var self = {
        title: 'Home',
        heading: locale.pages.home.heading,
        body: locale.pages.home.body
      }

      return self
    }

    /**
     * Route binding (controller)
     */
    function registerRoutes () {
      router('/', () => {
        viewEngine.render({
          name: 'home',
          template,
          vm: new HomeViewModel()
        })
      })
    }

    return {
      registerRoutes: registerRoutes
    }
  }
}
