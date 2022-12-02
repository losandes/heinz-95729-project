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
        id: product.id,
        uid: product.uid,
        title: product.title,
        description: product.description,
        metadata: product.metadata,
        price: product.price,
        images: [],
        thumbnailHref: product.thumbnailHref || '/images/products/default.png',
        thumbnailAlt: `thumbnail for ${product.title}`,
        showThumbnail: product.thumbnailHref != null,
        detailsLink: `/${product.type}/${product.uid}`,
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

      // add selected items to a cart object and save to localStorage
      self.addToCart = (event) => {
        console.log(this);
        console.log(`TODO: add ${self.title} to shopping cart`)
        let newCart = {};
        // check existing cart
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        if (Object.keys(cart).length == 0) {
          newCart = {
            [self.id]: self
          }
        } else {
          newCart = {
            ...cart,
            [self.id]: self
          }
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
      }

      return self
    }
  },
}
