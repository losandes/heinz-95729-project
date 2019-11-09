const { MongoClient, ObjectID, Server } = require('mongodb')
const nconf = require('nconf')
const async = require('async')
const seeds = require('./seeds')

const env = nconf
  .argv()
  .env()
  .file('environment', './common/environment/environment.json')

MongoClient(new Server(env.get('db:host'), parseInt(env.get('db:port'))))
  .connect((err, client) => {
    if (err) {
      throw err
    }

    const db = client.db(env.get('db:name'))
    const makeSeedHandler = (collection, seedName, seed) => (callback) => {
      const _seed = { ...seed, ...{ _id: new ObjectID(seed._id) } }

      collection.updateOne(
        { _id: _seed._id },
        { $set: _seed },
        { upsert: true },
        (err, result) => {
          if (err) {
            return callback(err)
          }

          return callback(null, {
            name: `${seedName}::${_seed.uid || _seed.email || _seed._id}`,
            matched: result.matchedCount,
            modified: result.modifiedCount,
            upsertedId: result.upsertedId || { _id: _seed._id }
          })
        })
    }

    const tasks = Object.keys(seeds).reduce((_tasks, key) => {
      const collection = db.collection(key)
      return _tasks.concat(seeds[key].map((seed) => makeSeedHandler(collection, key, seed)))
    }, [])

    async.parallel(tasks, (err, results) => {
      if (err) {
        console.log(' SEED ERROR:', err)
        process.exit(1)
      } else {
        console.log(results)
        process.exit(0)
      }
    })
  })
