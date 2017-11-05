const hilary = require('hilary')
const vows = require('vows')
const nconf = require('nconf')
const ObjectID = require('bson-objectid')
const environment = require('../environment/environment.js')
const env = environment.factory(nconf)
const scopeId = env.get('projectName')

module.exports.compose = TestComposition

function TestComposition (testTasks, done) {
  'use strict'

  const scope = hilary.scope(scopeId, {
    logging: {
      level: 'off' // trace|debug|info|warn|error|fatal|off
    }
  })
  var tasks = [
    scope.makeRegistrationTask(require('../../apis.js')),
    scope.makeRegistrationTask(require('../index.js')),
    scope.makeRegistrationTask(require('../error-handling')),
    scope.makeRegistrationTask(require('../express')),
    function composeUtils (scope, next) {
      scope.register({ name: 'appDir', factory: __dirname })
      scope.register({ name: 'ObjectID', factory: ObjectID, dependencies: [] })
      scope.register({ name: 'environment', factory: function () { return env } })

      scope.register({ name: 'vows', factory: vows })

      next(null, scope)
    },
    require('./composition-helpers/register-log-memory.js')
  ]

  // support done as a first arg
  done = done || testTasks

  // support tasks as a first arg
  if (Array.isArray(testTasks)) {
    tasks = tasks.concat(testTasks)
  }

  scope.bootstrap(tasks, done)
}
