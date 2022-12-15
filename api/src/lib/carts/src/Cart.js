/**

 * @param {@polyn/immutable} immutable
 * @param {uuid/v4} uuid
 * @param {Product} Product
 */

const { Product } = require('../product/src/Product')

class Cart {
  constructor (input) {
    this.products = input.products || []
  }

  addProduct (product) {
    // Ensure that the product being added is an instance of the Product class
    if (!(product instanceof Product)) {
      throw new Error('Product is not an instance of Product')
    }

    this.products.push(product)
  }

  removeProduct (productId) {
    this.products = this.products.filter((product) => product.id !== productId)
  }
}

function CartFactory (deps) {
  'use strict'


  const { immutable } = deps.immutable
  const { uuid } = deps

  const REGEX = {
    UUID: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  }




  const Cart = immutable('Order', CartBlueprint)
  Cart.blueprint = CartBlueprint

  return { Cart }
}

module.exports = CartFactory
