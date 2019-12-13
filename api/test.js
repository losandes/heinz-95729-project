const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const mongodb = require('mongodb')
const logger = require('./common/loggers/array-logger').factory()
const { MongoClient, Server } = require('mongodb')
const nconf = require('nconf')
const environment = require('./common/environment/environment.js')
const env = environment.factory(nconf)
const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect(`mongodb://${env.get('test_db:host')}:${env.get('test_db:port')}/${env.get('test_db:name')}`,
    { useNewUrlParser: true, useUnifiedTopology: true });
  return mongoose.connection;

}

module.exports = {
    blueprint,
    immutable,
    mongodb,
    logger,
    MongoClient,
    Server,
    connect,

}
