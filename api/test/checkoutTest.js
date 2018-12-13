/* global describe it */
const expect = require('chai').expect
const checkoutFactory = require('../checkout/checkout.js').factory
const stripe = require('stripe')('sk_test_msbYVDiCFgtNQsqZCZqnckYf')

describe('checkout', function () {
  const checkout = checkoutFactory(stripe)
  const checkoutInfo = {
    email: 'testing@gmail.com',
    tokenID: 123433433,
    total: 699,
    products: []
  }

  describe('When I try to checkout with an invalid token', function () {
    it('it should give a no such token error', function () {
      new Promise(checkout.charge(checkoutInfo, new Date()))
        .then(() => (err, actual) => {
          // eslint expecting error to be handled, but catch handles it.
          if (err) {}
        }).catch(err => {
          expect(err.message).to.equal('No such token: 123433433')
        })
    })
  })
})
