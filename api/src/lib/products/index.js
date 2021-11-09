const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const path = require('path')
const uuid = require('uuid').v4
const { Product } = require('./src/Product.js')({ blueprint, immutable, uuid })
const { ProductPgRepo } = require('./src/ProductPgRepo.js')({ blueprint, Product })
const GetProductFactory = require('./src/get-product.js')
const FindProductFactory = require('./src/find-product.js')
const MigrateProductsFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function ProductsFactory (input) {
  const productRepo = new ProductPgRepo({ knex: input.knex })
  const { getProduct } = new GetProductFactory({ productRepo })
  const { findProduct } = new FindProductFactory({ productRepo })
  const migrate = MigrateProductsFactory({ path, knex: input.knex })

  return {
    Product,
    productRepo,
    getProduct,
    findProduct,
    migrate,
  }
}

module.exports = ProductsFactory
