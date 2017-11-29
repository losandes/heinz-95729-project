/*
// See the README.md for info on this module
*/
module.exports.name = 'Grocery'
module.exports.dependencies = ['polyn', 'Product', 'logger']
module.exports.factory = function ({ Blueprint }, Product, logger) {
  var blueprint,
    Grocery

    // The Product blueprint will validate the majority of the model.
    // This blueprint is meant to enforce properties that are unique to Book.
  blueprint = new Blueprint({
    metadata: new Blueprint({
      grocery: 'array'
    })
  })

  Grocery = function (grocery) {
    // Inherit Product
    var self = new Product(grocery)

    // Validate that this meets the Book schema
    if (!grocery || !blueprint.syncSignatureMatches(grocery).result) {
      logger.error(new Error(
        blueprint.syncSignatureMatches(grocery).errors.join(', ')
      ))
      return
    }

    return self
  }

  return Grocery
}
