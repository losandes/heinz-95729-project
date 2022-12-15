
/**
 * @param {knex} knex
 */
function MigrateCartsFactory (deps) {
  'use strict'

  const { path, knex } = deps
  const directory = path.join(__dirname, 'migrations')
  const tableName = 'z_migrations_carts'

  const up = async () => {
    await knex.migrate.latest({ directory, tableName })
    return knex.migrate.list({ directory })
  }

  const down = async () => knex.migrate.rollback({ directory, tableName }, true /* all */)

  return { up, down }
}

module.exports = MigrateCartsFactory
