// Provided by Andy Wright to help understand JS testing.
/* global describe it */
const expect = require('chai').expect
const Router = function () {
  const history = []
  const navigate = (location) => {
    history.push(location)
  }

  return { navigate, history }
}
const productFactory = require('../scripts/products/Product.js').factory

describe('Product', () => {
  describe('when viewDetails is executed, and the product type is "book"', () => {
    const uid = 'test'
    const router = new Router()
    const Product = productFactory(router)
    const product = new Product({ type: 'book', uid })
    product.viewDetails()

    it('it should navigate to /books/:uid', () => {
      expect(router.history[0]).to.equal(`/books/${uid}`)
    })

    it('it should navigate to /books/:uid', () => {
      expect(router.history.length).to.equal(1)
    })
  })
})
