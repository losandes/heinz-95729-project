/*
// See the README.md for info on this module
*/
module.exports.name = 'Book'
module.exports.dependencies = ['polyn', 'Product', 'logger']
module.exports.factory = function ({ Blueprint }, Product, logger) {
  var blueprint,
    Book

    // The Product blueprint will validate the majority of the model.
    // This blueprint is meant to enforce properties that are unique to Book.
  blueprint = new Blueprint({
    metadata: new Blueprint({
      authors: 'array'
    })
  })

  Book = function (book) {
    // Inherit Product
    var self = new Product(book)

    // Validate that this meets the Book schema
    if (!book || !blueprint.syncSignatureMatches(book).result) {
      logger.error(new Error(
        blueprint.syncSignatureMatches(book).errors.join(', ')
      ))
      return
    }

    return self
  }

  return Book
}
