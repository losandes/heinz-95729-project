module.exports = {
  scope: 'heinz',
  name: 'Product',
  dependencies: ['router'],
  factory: (router) => {
    'use strict'

    return function Product (product) {
      product = Object.assign({}, product)

      const self = {
        type: product.type || 'product',
        _id: product._id,
        uid: product.uid,
        title: product.title,
        description: product.description,
        metadata: product.metadata,
        price: product.price,
		purchased_quantity: product.purchased_quantity,
        images: [],
        thumbnailLink: product.thumbnailLink || '/images/products/default.png',
        thumbnailAlt: `thumbnail for ${product.title}`,
        showThumbnail: product.thumbnailLink != null,
        detailsLink: `/${product.type}/${product.uid}`
      }

      self.viewDetails = (event) => {
        if (!self.uid) {
          // this must be the default VM
          return
        }

        switch (self.type) {
          case 'book':
            router.navigate(`/books/${self.uid}`)
            break
          default:
            router.navigate(`/products/${self.uid}`)
            break
        }
      }

      self.addToCart = (event) => {
        console.log(`TODO: add ${self.title} to shopping cart`)
      }

      return self
    }
  }
}
