const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')
const { expect } = chai
const { CartPgRepo } = require('../src/CartPgRepo')

chai.use(sinonChai)
chai.use(chaiAsPromised)

describe('CartPgRepo', () => {
  let cartRepo
  let knex

  beforeEach(() => {
    knex = {
      transaction: sinon.stub().resolves(),
      from: sinon.stub().returnsThis(),
      insert: sinon.stub().returnsThis(),
      onConflict: sinon.stub().returnsThis(),
      merge: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      where: sinon.stub().returnsThis(),
      del: sinon.stub().resolves(),
    }
    cartRepo = new CartPgRepo({ knex })
  })

  describe('upsert', () => {
    it('inserts or updates a product in the cart', async () => {
      const product = { id: '123', name: 'Test Product' }
      const res = { rowCount: 1 }

      knex.transaction.resolves(res)

      const result = await cartRepo.upsert(product)

      expect(result).to.deep.equal({ product, res })
    })

    it('throws an error if the number of operations is unexpected', () => {
      const product = { id: '123', name: 'Test Product' }
      const res = { rowCount: 2 }

      knex.transaction.resolves(res)

      expect(cartRepo.upsert(product)).to.be.rejectedWith('The number of operations to upsert a record was not expected')
    })
  })

  describe('get.byId', () => {
    it('gets a product from the cart by its ID', async () => {
      const productId = '123'
      const product = { id: '123', name: 'Test Product' }

      knex.select.returns([product])

      const result = await cartRepo.get.byId(productId)

      expect(result).to.deep.equal(product)
    })

    it('returns null if the product is not found', async () => {
      const productId = '123'

      knex.select.returns([])

      const result = await cartRepo.get.byId(productId)

      expect(result).to.be.null
    })
  })

  describe('delete.byId', () => {
    it('deletes a product from the cart by its ID', async () => {
      const productId = '123'
      const result = true

      knex.del.resolves(result)

      const deleteResult = await cartRepo.expect(deleteResult).to.be.true
    })
    
    it('returns false if the product is not found', async () => {
      const productId = '123'
      const result = 0
    
      knex.del.resolves(result)
    
      const deleteResult = await cartRepo.delete.byId(productId)
    
      expect(deleteResult).to.be.false
    })
})
})
