const db = require('knex')
const supposed = require('supposed')
const expect = require('unexpected')
const pkg = require('./package.json')
const CartsFactory = require('.')

const knex = db({
  client: 'pg',
  connection: process.env.DB_CONNECTION_STRING,
  migrations: {
    tableName: 'z_migrations_default',
  },
})
const teardowns = [() => knex.destroy()]

const suite = supposed.Suite({
  name: pkg.name,
  assertionLibrary: expect,
  inject: { Carts: CartsFactory({ knex }) },
})

const runner = suite.runner({
  cwd: __dirname,
})

const plan = runner.plan()

module.exports = { suite, runner, plan, teardowns }
