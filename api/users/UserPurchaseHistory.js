module.exports.name = 'UserPurchaseHistory'
module.exports.dependencies = ['polyn', 'ObjectID', 'logger']
module.exports.factory = function ({ Blueprint }, ObjectID, logger) {
  var blueprint,
    UserPurchaseHistory

  blueprint = new Blueprint({
    __blueprintId: 'User',
    name: 'string',
    email: 'string'
  })

  UserPurchaseHistory = function (doc) {
    var self = []

    if (!blueprint.syncSignatureMatches(doc).result) {
      // If it doesn't, log the error
      logger.error(new Error(
        blueprint.syncSignatureMatches(doc).errors.join(', ')
      ))
      // We don't know whether or not it will actually throw, so return undefined;
      return
    }

    // Create purchase history
    for (let i = 0; i < doc.purchaseHistory.length; i++) {
      self[i] = {}
      self[i].time = doc.purchaseHistory[i].time
      self[i].amount = doc.purchaseHistory[i].amount
      self[i].items = []

      let noItems = doc.purchaseHistory[i].products.length

      for (let j = 0; j < noItems; j++) {
        let item = {}
        item.type = doc.purchaseHistory[i].products[j].type
        item.title = doc.purchaseHistory[i].products[j].title
        item.uid = doc.purchaseHistory[i].products[j].uid
        item.price = doc.purchaseHistory[i].products[j].price
        item.authors = doc.purchaseHistory[i].products[j].metadata.authors
        self[i].items[j] = item
      }
    }

    // Order by purchase date
    self.sort(function (a, b) { return b.time - a.time })

    return self
  }

  return UserPurchaseHistory
}
