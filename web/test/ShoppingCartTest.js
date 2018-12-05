/* global describe it before */
const expect = require('chai').expect
const Router = function () {
  const history = []
  const navigate = (location) => {
    history.push(location)
  }

  return { navigate, history }
}
const productFactory = require('../scripts/products/Product.js').factory
const ShoppingCartFactory = require('../scripts/cart/ShoppingCart').factory

describe('ShoppingCart', function () {
  const router = new Router()
  const Product = productFactory(router)
  const shoppingCart = ShoppingCartFactory()
  const product1 = new Product({ type: 'book', uid: 'test1', price: 5.99 })
  const product2 = new Product({ type: 'book', uid: 'test2', price: 5.00 })

  describe('When shopping cart is first created', function () {
    it('it should not contain any items', function () {
      expect(shoppingCart.getItems().size).to.equal(0)
    })

    it('it should have a subtotal of $0.00', function () {
      expect(shoppingCart.getSubtotal()).to.equal('0.00')
    })
  })

  describe('When 2 products are added to the shopping cart', function () {
    before(function () {
      shoppingCart.addItem(product1)
      shoppingCart.addItem(product2)
    })

    it('it should contain 2 items', function () {
      expect(shoppingCart.getItems().size).to.equal(2)
    })
    it('it should have a subtotal of $10.99', function () {
      expect(shoppingCart.getSubtotal()).to.equal('10.99')
    })
  })

  describe('When I remove a product from the shopping cart', function () {
    before(function () {
      shoppingCart.removeItem(product1)
    })

    it('it should contain 1 item', function () {
      expect(shoppingCart.getItems().size).to.equal(1)
    })
    it('it should have a subtotal of $5.00', function () {
      expect(shoppingCart.getSubtotal()).to.equal('5.00')
    })
  })
})
