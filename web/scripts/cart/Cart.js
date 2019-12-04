module.exports = {
  scope: 'heinz',
  name: 'Cart',
  dependencies: ['storage', 'cartRepo'],
  factory: (storage, cartRepo) => {
    'use strict'

    return function Cart(cart) {
      cart = Object.assign({}, cart)
      const user = storage.get('user')
      const uid = user._id
      const self = {
        total: "0",
        items: [],
        uid: uid
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
      return self
    }
  }
}