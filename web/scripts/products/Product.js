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
      let cart = storage.get('localCart') || []
      let total = storage.get('totalPrice')||0
  
      self.addToCart = (event) => {
        var uid = ''
        const data = {
          name: self.title,
          quantity: ++quantity,
          price: self.price,
          item_uid: self.uid,
          uid: uid
        }
        if(storage.exists('jwt')){
          const user = storage.get('user')
          uid = user._id
          data.uid = uid

          console.log("Adding... \n" + data);

          productsRepo.addToCart(data, (err, res) => {
            if (err) {
              console.log(err)
              alert('Add to cart failed')
              return
            }
  
            console.log(res);
            if(res){
              storage.set('cart', res.items)
              router.navigate(`/checkout`)
            }
          })
        }
        else{
          const repeat = cart.some(el => el.item_uid === data.item_uid)
          if(!repeat){
            cart.push(data)
            total += data.price
            console.log(cart)
            storage.set('localCart',cart)
            storage.set('totalPrice',total)
            router.navigate(`/checkout`)
          }else{
            alert('Item alreay in Cart')
          }

        }
      }

      return self
    }
  }
}
