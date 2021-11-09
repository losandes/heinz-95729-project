const db = require('knex')
const supposed = require('supposed')
const expect = require('unexpected')
const pkg = require('./package.json')
const UsersFactory = require('.')

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
  inject: {
    Users: UsersFactory({
      knex,
      env: {
        NODE_ENV: 'local',
        NODE_ENV_OPTIONS: { LOCAL: 'local' },
        JWT_COOKIE_NAME: 'h9test',
        JWT_SECRET: 'b85a7cd9ac2346cab6307ed231e45d30',
        JWT_EXPIRES_IN: '30d',
        JWT_EXPIRES_IN_MS: 86400000 * 30,
      },
    }),
  },
})

const runner = suite.runner({
  cwd: __dirname,
})

const plan = runner.plan()

module.exports = { suite, runner, plan, teardowns }
