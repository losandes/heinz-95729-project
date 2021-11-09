/* global hilary, Vue, page, sessionStorage */
(function (hilary, Vue, page, sessionStorage) {
  'use strict'

  const scope = hilary.scope('heinz', {
    logging: {
      level: 'info', // trace|debug|info|warn|error|fatal|off
      // printer: function (entry) {
      //
      // }
    },
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
      log('registering utils')  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      scope.register({ name: 'locale', factory: locale, dependencies: false })
      scope.register({ name: 'storage-engine', factory: sessionStorage, dependencies: false })

      next(null, scope)
    },
    (scope, next) => {
      log('creating components')  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      const byComponents = () => key => {
        return key.toLowerCase().indexOf('component') > -1
      }
      const toComponent = (scope) => key => {
        return scope.resolve(key).component
      }
      const toObject = () => (output, component) => {
        output[component.extendOptions.name] = component
        return output
      }

      const components = Object.keys(scope.context.container.get())
        .concat(Object.keys(scope.context.singletonContainer.get()))
        .filter(byComponents())
        .map(toComponent(scope))
        .reduce(toObject(), {
          loading: { template: '#t-loading' },
        })

      next(null, components, scope)
    },
    (components, scope, next) => {
      log('binding the main app')  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      const app = new Vue({
        el: '#app',
        data: {
          currentView: 'loading',
          vm: null,
        },
        components,
      })

      scope.register({ name: 'app', factory: app, dependencies: false })

      next(null, app, scope)
    },
    (app, scope, next) => {
      log('binding the header component')  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      const headerComponent = new Vue({
        el: '#header',
        data: {
          title: locale.title,
          query: '',
        },
        methods: {
          search: () => {
            scope.resolve('router')
              .navigate(`/products?q=${headerComponent.query}`)
          },
        },
      })

      scope.register({ name: 'header', factory: headerComponent, dependencies: false })

      next(null, headerComponent, app, scope)
    },
    (headerComponent, app, scope, next) => {
      log('registering routes')  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      const byControllers = () => key => {
        return key.toLowerCase().indexOf('controller') > -1
      }
      const toController = (scope) => (key) => {
        return scope.resolve(key)
      }
      const registerRoutes = () => controller => {
        // execute the controller modules to register routes on the router
        if (typeof controller.registerRoutes === 'function') {
          controller.registerRoutes(app)
        }
      }

      Object.keys(scope.context.container.get())
        .concat(Object.keys(scope.context.singletonContainer.get()))
        .filter(byControllers())
        .map(toController(scope))
        .forEach(registerRoutes())

      next(null, app, scope)
    },
    (app, scope, next) => {
      log('listening')  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      page('*', function (context) {   // 404 catch-all
        console.log('404', context)
        app.currentView = 'home'
      })

      page()                    // start listening
    },
  ], function (err) {
    if (err) {
      log(err)
    } else {
      log('application running')
    }
  })
}(hilary, Vue, page, sessionStorage))
