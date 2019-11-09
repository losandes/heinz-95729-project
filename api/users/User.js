module.exports.name = 'User'
module.exports.dependencies = ['@polyn/blueprint', '@polyn/immutable', 'ObjectID', 'logger']
module.exports.factory = function (_blueprint, _immutable, ObjectID, logger) {
  'use strict'

  const { optional } = _blueprint
  const { immutable } = _immutable
  const userBp = {
    _id: optional('string')
      .from(({ value }) => value ? new ObjectID(value).toString() : null)
      .withDefault(new ObjectID().toString()),
    name: 'string',
    email: 'string'
  }

  const User = immutable('User', userBp)
  User.blueprint = Object.freeze(userBp)

  User.db = {
    collection: 'users',
    indexes: [
      {
        keys: { email: 1 },
        options: { name: 'unq.users.email', unique: true, sparse: true }
      }
    ]
  }

  return User
}
