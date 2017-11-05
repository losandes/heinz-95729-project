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
        images: [],
        thumbnailLink: product.thumbnailLink || '/images/products/default.png',
        thumbnailAlt: `thumbnail for ${product.title}`,
        showThumbnail: product.thumbnailLink != null,
        detailsLink: `/${product.type}/${product.uid}`,
        authors: product.metadata && Array.isArray(product.metadata.authors)
          ? product.metadata.authors
          : []
      }

      self.viewDetails = (event) => {
        if (self.uid) {
          router.navigate(`/products/${self.uid}`)
        }
      }

      self.addToCart = (event) => {
        console.log(`TODO: add ${self.title} to shopping cart`)
      }

      return self
    }
  }
}
