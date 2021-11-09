const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const path = require('path')
const BookFactory = require('./src/Book.js')
const CreateProductFactory = require('./src/create-book.js')
const MigrateBooksFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 * @param {Product} Product - The Product constructor from @sample-node-api/products
 * @param {ProductPgRepo} productRepo - An initialized product repository from @sample-node-api/products
 */
module.exports = function (input) {
  const { Product, productRepo } = input
  const { Book } = BookFactory({ blueprint, immutable, Product })
  const { createBook } = new CreateProductFactory({ Book, productRepo })
  const migrate = MigrateBooksFactory({ path, knex: input.knex })

  return {
    Book,
    createBook,
    migrate,
  }
}
