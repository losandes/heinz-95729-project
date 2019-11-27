module.exports.name = 'addToExistingCart'
module.exports.dependencies = ['cartsRepo', 'Cart']
module.exports.factory = function (repo, Cart) {
  'use strict'

  const validateCartItem = (item) => (resolve, reject) => {
    //TODO: validate cart item
  }
  /**
   * Adds a new item to an existing shopping cart
   * @param {Object} item - the new item to be added to an existing shopping cart
   */
  const addToExistingCart = (item, cart) => (resolve, reject) => {

    if(isItemInItems(item, cart.items)){
      return resolve(cart)
    }
    return repo.add(item)
      .then(resolve)
      .catch(reject)
  }

  const isItemInItems = (item, cartItems) => {
    for(var i=0; i < cartItems.length; i++){
      if (cartItems[i].item_uid == item.item_uid){
        return true
      }
    }
    return false;
  }

  /**
   * Computes the total of all items in the shopping cart
   * @param {*} cartItems 
   */
  const computeCartTotal = (cartItems, newItem) => {
    var total = 0.0
    cartItems.forEach(function (item) {
      total = total + (item.price * item.quantity)
    });
    total = total + (newItem.price * newItem.quantity)
    return total.toFixed(2)
  }
  
  /**
   * Updates the total price of all items with a shopping cart
   * @param {Object} cart - the cart 
   */
  const updateCartTotal = (cart, newItem) => (resolve, reject) => {
    return repo.updateCartTotal(cart.uid, computeCartTotal(cart.items, newItem))
      .then(resolve)
      .catch(reject)
  }

  const bindUpdateToCart = (doc) => (resolve, reject) => {
    //cart item for an updated cart will be bound to the value property
    //of the return object. If no update was carried then such property
    //doesn't exist
    doc = doc.value != undefined ? doc.value : doc
    return resolve(doc)
  }

  

  return { addToExistingCart, updateCartTotal, bindUpdateToCart }
}
