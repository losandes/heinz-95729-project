const { expect } = require('chai')
const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const { ObjectID } = require('mongodb')
const logger = require('./common/loggers/array-logger').factory()
const supposed = require('supposed')

module.exports = supposed.Suite({
  name: 'heinz-95729-project-api',
  assertionLibrary: expect,
  inject: {
    blueprint,
    immutable,
    ObjectID,
    logger
  }
}).runner({
  cwd: __dirname
}).run()
