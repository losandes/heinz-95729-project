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
        console.log(`TODO: add ${self.title} to shopping cart`)
        var product = self;
        var productName = product.title
        var productPrice = product.price
        var quantity = 1
        var currItems = sessionStorage.getItem("productsInCart")
        var productsInCart = []
        console.log(productsInCart)
        productsInCart.push(productName)
        var totalPrice = sessionStorage.getItem("totalPrice")
        var price = 10.69
        totalPrice = 0.00 + (productPrice * quantity)
        sessionStorage.setItem("productsInCart", productsInCart);
        sessionStorage.setItem("totalPrice", totalPrice);
        console.log(`Product Name To Add: ${self.title}`)
        console.log(`Product Quantity To Add: 1`)
        console.log(`Product Price To Add: ${self.price}`)
        console.log("Added to cart! Cart now contains: " + sessionStorage.getItem("productsInCart").toString())
      }

      //var allTotals = sessionStorage.getItem("totalPrice")
      //var allProducts = sessionStorage.getItem("productsInCart")
      //console.log("The total price to date is: " + str(allTotals))
      //console.log("The total items in the cart to date is: " + str(allProducts))
      return self
    }
  }
}
