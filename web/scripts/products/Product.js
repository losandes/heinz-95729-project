module.exports = {
  scope: 'heinz',
  name: 'Product',
  dependencies: ['router', 'productsRepo', 'storage'],
  factory: (router, productsRepo, storage) => {
    'use strict'

    return function Product(product) {
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

      let quantity = 0
      self.addToCart = (event) => {

        const user = storage.get('user')
        const data = {
          name: self.title,
          quantity: ++quantity,
          price: self.price,
          item_uid: self.uid,
          uid: user._id
        }

        console.log("Adding... \n" + data);

        productsRepo.addToCart(data, (err, res) => {
          if (err) {
            console.log(err)
            alert('Add to cart failed')
            return
          }

          console.log(res);

          storage.set('cart', res.items)

          return router.navigate(`/checkout`)
        })
      }

      return self
    }
  }
}
