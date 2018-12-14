module.exports.name = 'User'
module.exports.dependencies = ['polyn', 'ObjectID', 'logger']
module.exports.factory = function ({ Blueprint }, ObjectID, logger) {
  var blueprint,
    User

  blueprint = new Blueprint({
    __blueprintId: 'User',
    name: 'string',
    email: 'string',
	purchase: [{
		product_id : 'string'
  }]})

  User = function (user) {
    var self = {}
    user = Object.assign({}, user)

    if (!blueprint.syncSignatureMatches(user).result) {
      // If it doesn't, log the error
      logger.error(new Error(
        blueprint.syncSignatureMatches(user).errors.join(', ')
      ))
      // We don't know whether or not it will actually throw, so return undefined;
      return
    }

    self._id = new ObjectID(user._id)
    self.name = user.name
    self.email = user.email
	self.purchase = user.purchase
	
    return self
  }

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
