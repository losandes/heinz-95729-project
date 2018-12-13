/* global describe it */
const expect = require('chai').expect
const CheckoutFactory = require('../scripts/checkout/Checkout.js').factory
const checkoutInfo = {
  email: 'testing@gmail.com',
  tokenID: 'purchaseInfo.tokenID',
  total: '14.99',
  products: []
}

describe('Checkout', function () {
  const Checkout = CheckoutFactory()
  const checkout = new Checkout(checkoutInfo)
  describe('When I create a new checkout item', function () {
    it('the total should be converted to an int', function () {
      expect(checkout.total).to.be.a('number')
    })
    it('the total should be in 1499 cents', function () {
      expect(checkout.total).to.equal(1499)
    })
  })
})
