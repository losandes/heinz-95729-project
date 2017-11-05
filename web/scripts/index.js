/* global hilary, Vue, page, sessionStorage */
(function (hilary, Vue, page, sessionStorage) {
  'use strict'

  const scope = hilary.scope('heinz', {
    logging: {
      level: 'info' // trace|debug|info|warn|error|fatal|off
      // printer: function (entry) {
      //
      // }
    }
  })
  const locale = scope.resolve('locale::en_US')
  const log = (message) => {
    if (typeof message === 'string') {
      console.log(`startup::heinz95729::${message}`)
    } else {
      console.log(message)
    }
  }

  scope.bootstrap([
    (scope, next) => { log('composing application'); next(null, scope) },
    (scope, next) => {
      log('registering utils')
      scope.register({ name: 'locale', factory: locale, dependencies: false })
      scope.register({ name: 'storage-engine', factory: sessionStorage, dependencies: false })

      next(null, scope)
    },
    (scope, next) => {
      log('binding the main app')

      const app = new Vue({
        el: '#app',
        data: {
          currentView: 'loading',
          vm: null
        },
        components: {
          'empty': { template: '#t-empty' },
          'loading': { template: '#t-loading' }
        }
      })

      const ViewEngine = scope.resolve('ViewEngine')
      const viewEngine = new ViewEngine(app)
      scope.register({ name: 'viewEngine', factory: viewEngine, dependencies: false })

      next(null, app, viewEngine, scope)
    },
    (app, viewEngine, scope, next) => {
      log('binding the header component')

      const { makeSearchHandler } = scope.resolve('searchComponent')
      const headerComponent = new Vue({
        el: '#header',
        data: {
          title: locale.title,
          query: ''
        },
        methods: {
          search: makeSearchHandler(() => headerComponent.query)
        }
      })

      next(null, headerComponent, app, viewEngine, scope)
    },
    (headerComponent, app, viewEngine, scope, next) => {
      log('registering routes')

      const router = scope.resolve('router')
      const findComponents = key => {
        return key.toLowerCase().indexOf('component') > -1
      }
      const registerRoutes = key => {
        // execute the controller modules to register routes on the router
        const component = scope.resolve(key)
        if (typeof component.registerRoutes === 'function') {
          component.registerRoutes()
        }
      }

      Object.keys(scope.context.container.get())
        .filter(findComponents)
        .forEach(registerRoutes)

      Object.keys(scope.context.singletonContainer.get())
        .filter(findComponents)
        .forEach(registerRoutes)

      router('*', function () { // 404 catch-all
        viewEngine.render({
          name: 'home',
          vm: {}
        })
      })

      next(null, scope)
    },
    (scope, next) => {
      log('listening')
      page()
    }
  ], function (err) {
    if (err) {
      log(err)
    } else {
      log('application running')
    }
  })
}(hilary, Vue, page, sessionStorage))
