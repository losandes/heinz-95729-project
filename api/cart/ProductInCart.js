module.exports.name = 'ProductInCart'
module.exports.dependencies = ['ObjectID']
module.exports.factory = function (ObjectID) {
  var Product

  /*
    // This is the Product constructor, which will be returned by this factory
    */
  Product = function (product) {
    // often times, we use selfies to provide a common object on which
    // to define properties. It's also common to see `var self = this`.
    var self = {}

    // define the Product properties from the product argument
    self._id = new ObjectID(product._id)
    self.uid = product.uid
    self.title = product.title
    self.description = product.description
    self.metadata = product.metadata
    self.price = product.price
    self.thumbnailLink = product.thumbnailLink
    self.type = product.type
    self.quantity = product.quantity
    self.email = product.email

    return self
  }
  return Product
}
