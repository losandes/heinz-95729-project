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
          case 'grocery':
            router.navigate(`/groceries/${self.uid}`)
            break;
          default:
            router.navigate(`/products/${self.uid}`)
            break
        }
      }

      self.addToCart = (event) => {
        //console.log(`TODO: add ${self.title} to shopping cart`)
        var product = self;
        if (localStorage.getItem("productsInCart") === null) {
          localStorage.setItem("productsInCart", JSON.stringify([product]))
          var productsInCart = localStorage.getItem("productsInCart")
        }
        else {
          var productsInCart = JSON.parse(localStorage.getItem("productsInCart"))
          console.log("Products in Cart: ", productsInCart)
          console.log("Products in Cart Type: ", typeof(productsInCart))
          productsInCart.push(product)
          localStorage.setItem("productsInCart", JSON.stringify(productsInCart))
          console.log("Added to cart! Cart now contains: " + localStorage.getItem("productsInCart").toString())
        }
      }

      return self
    }
  }
}
