module.exports = {
  scope: 'heinz',
  name: 'Cart',
  dependencies: ['storage', 'cartRepo', 'JSON'],
  factory: (storage, cartRepo, JSON) => {
    'use strict'

    return function Cart(cart) {
      cart = Object.assign({}, cart)
      var user = ''
      var uid = ''
      var self = {
        total: "0",
        items: [],
        uid: uid
      }
      if(storage.exists('jwt')){
         user = storage.get('user')
         uid = user._id

         self.uid = uid
        
         cartRepo.getCart(uid, (err, res) => {
          if (err) {
            console.log(err)
            alert('Get cart failed')
            return
          }
          self.total = res.total || 0
          self.items = res.items
          return res
        })
      }
      else{
        var localCart = JSON.parse(localStorage.getItem('localCart')) || storage.get('localCart')
        var totalPrice = JSON.parse(localStorage.getItem('totalPrice')) || storage.get('totalPrice')
        console.log(localCart)
        self.items = localCart
        self.total = totalPrice
      }


      return self
    }
  }
}