module.exports = {
  scope: 'heinz',
  name: 'Cart',
  // dependencies: ['router', 'storage', 'cartRepo'],
  dependencies: ['cartRepo'],
  factory: (cartRepo) => {
    'use strict'

    return function Cart(cart) {
      cart = Object.assign({}, cart)
      const uid = '5de66d336b31ea06bf0a928a'
      const self = {
        total: "0",
        items: []
      }
      cartRepo.getCart(uid, (err, res) => {
        if (err) {
          console.log(err)
          alert('Get cart failed')
          return
        }
        self.total = res.total
        self.items = res.items
        return res
      })

      // const self = new Cart()
      // cart = Object.assign({}, book)

      // // Add authors to the product model
      // self.authors = book.metadata && Array.isArray(book.metadata.authors)
      //   ? book.metadata.authors
      //   : []

      // // override product's `viewDetails` function to redirect to books
      // self.viewDetails = (event) => {
      //   if (self.uid) {
      //     router.navigate(`/books/${self.uid}`)
      //   }
      // }

      // if (storage.get('user') !== undefined) {
      //   const user = storage.get('user')
      //   //const cart = cartRepo.getCart(user._id,(err,res))
      //   console.log(cart)

      //   cartRepo.getCart(user._id, (err, res) => {
      //     if (err) {
      //       console.log(err)
      //       alert('Get cart failed')
      //       return
      //     }

      //     console.log(res);

      //     // storage.set('cart', res.items)

      //     // return router.navigate(`/checkout`)
      //   })
      // }
      return self
    }
  }
}