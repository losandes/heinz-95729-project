module.exports = {
  scope: 'heinz',
  name: 'CartProduct',
  dependencies: ['router', 'cartComponent'],
  factory: (router, cartComponent) => {
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
        quantity: product.quantity
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

      self.subtotal = () => {
        return Math.round(self.quantity * self.price * 100) / 100
      }

      self.increment = (state) => {
        console.log(`TODO: increment ${self.title} to shopping cart`)
        console.log(state)
        console.log(self.quantity)
        self.quantity = self.quantity + 1
        console.log(self.quantity)
        cartComponent.updateSubtotal()
        // document.getElementById('test').textContent = self.quantity
      }

      self.decrement = () => {
        if (self.quantity === 0) return
        console.log(`TODO: decrement ${self.title} to shopping cart`)
        console.log(self.quantity)
        self.quantity = self.quantity - 1
        console.log(self.quantity)
        cartComponent.updateSubtotal()
      }

      return self
    }
  }
}
