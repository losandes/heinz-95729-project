'use strict'

module.exports.init = init

const hilary = require('hilary')
const express = require('express')
const nconf = require('nconf')
const ObjectID = require('bson-objectid')
const { MongoClient, Server } = require('mongodb')
// directories
const environment = require('./common/environment/environment.js')
const env = environment.factory(nconf)
const scopeId = env.get('projectName')
// log and various other function defined at bottom

function init () {
  var scope = hilary.scope(scopeId, {
    logging: {
      level: 'info' // trace|debug|info|warn|error|fatal|off
      // printer: function (entry) {
      //
      // }
    }
  })

  scope.bootstrap([
    function (scope, next) { log('composing application'); next(null, scope) },
    scope.makeRegistrationTask(require('./books')),
    scope.makeRegistrationTask(require('./common/express')),
    scope.makeRegistrationTask(require('./common/loggers')),
    scope.makeRegistrationTask(require('./common/utils')),
    scope.makeRegistrationTask(require('./fp-growth')),
    scope.makeRegistrationTask(require('./home')),
    scope.makeRegistrationTask(require('./legos')),
    scope.makeRegistrationTask(require('./products')),
    scope.makeRegistrationTask(require('./users')),

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // TODO: REGISTER ANY NEW FOLDERS YOU CREATE HERE
    // Make sure the folder has an index.js in it.
    // Look at the home folder for an example
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    scope.makeRegistrationTask(require('./shopping-cart')),
    scope.makeRegistrationTask(require('./orders')),



    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // /TODO: REGISTER ANY NEW FOLDERS YOU CREATE HERE
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    function composeUtils (scope, next) {
      scope.register({ name: 'appDir', factory: __dirname })
      scope.register({ name: 'ObjectID', factory: ObjectID, dependencies: [] })
      scope.register({ name: 'environment', factory: function () { return env } })
      next(null, scope)
    },
    function connectToAndRegisterDataConnection (scope, next) {
      MongoClient(new Server(env.get('db:host'), parseInt(env.get('db:port'))))
        .connect((err, client) => {
          if (err) {
            log(err)
            throw err
          }

          const db = client.db(env.get('db:name'))

          scope.register({ name: 'db', factory: function () { return db } })
          next(null, scope)
        })
    },
    function composeExpress (scope, next) {
      /*
      // Configures the express app and adds common middleware
      */

      const expressSingleton = express()
      const router = express.Router()

      scope.register({ name: 'express', factory: function () { return express } })             // lib
      scope.register({ name: 'express-singleton', factory: function () { return expressSingleton } })    // single instance used for app
      scope.register({ name: 'router', factory: function () { return router } })              // route engine
      next(null, scope, router)
    },
    function registerRoutes (scope, router, next) {
      /*
            // Register the routes / controllers, by resolving them
            */

      log('registering routes')

      const findControllers = key => {
        return key.toLowerCase().indexOf('controller') > -1
      }
      const registerRoutes = key => {
        // execute the controller modules to register routes on the router
        scope.resolve(key)
      }

      Object.keys(scope.context.container.get())
        .filter(findControllers)
        .forEach(registerRoutes)

      Object.keys(scope.context.singletonContainer.get())
        .filter(findControllers)
        .forEach(registerRoutes)

      next(null, scope, router)
    },
    function startAndRegisterExpress (scope, router, next) {
      /*
            // Configure and start the express app, and then register it
            // so other modules can depend on it (required for `www`)
            */

      log('starting express')

      scope.resolve('express-startup').init(router, function (err, app) {
        if (err) {
          return next(err)
        }

        scope.register({
          name: 'express-app',
          factory: function () {
            return app
          }
        })

        next(null, scope)
      })
    },
    // NOTE: Add any other necessary composition tasks here;
    // BEFORE adding makeHttpServerStartupTask
    function makeHttpServerStartupTask (scope, next) {
      /*
            // Make an async task that starts the HTTP server (starts listening)
            // and registers a singleton `server`, so other modules can depend on it
            */

      var server

      scope.register({
        name: 'server',
        factory: function () {
          return server
        }
      })

      log('starting the HTTP server')

      // start the HTTP services
      server = scope.resolve('www')

      next(null, scope)
    }
  ], function (err) {
    if (err) {
      log(err)
    } else {
      log('application running')
    }
  })
}

function log (message) {
  if (typeof message === 'string') {
    console.log(`startup::${scopeId}::${message}`)
  } else {
    console.log(message)
  }
}
