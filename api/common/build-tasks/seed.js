const mongodb = require('mongodb')
const nconf = require('nconf')
const async = require('async')
const seeds = require('./seeds')

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const env = nconf
  .argv()
  .env()
  .file('environment', './common/environment/environment.json')

MongoClient.connect(env.get('db:connection-string'), (err, db) => {
  if (err) {
    throw err
  }

  function makeSeedHandler (collection, seedName, seed) {
    return (callback) => {
      seed._id = new ObjectID(seed._id)

      collection.updateOne(
        { _id: seed._id },
        seed,
        { upsert: true, forceServerObjectId: true },
        (err, result) => {
          if (err) {
            return callback(err)
          }

          return callback(null, {
            name: `${seedName}::${seed.uid || seed.email || seed._id}`,
            matched: result.matchedCount,
            upserted: result.upsertedCount
          })
        })
    }
  }

  const tasks = []

  Object.keys(seeds).forEach(key => {
    const collection = db.collection(key)
    return seeds[key].forEach(seed => {
      tasks.push(makeSeedHandler(collection, key, seed))
    })
  })

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
