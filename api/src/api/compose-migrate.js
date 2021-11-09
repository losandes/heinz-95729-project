const StartupError = require('./StartupError.js')

/**
 * Conditionally migrates the database schema
 * @curried
 * @param {/^(up|down)$/} direction - whether to migrate up or down
 * @param context the context produced by `bootstrap`
 */
const migrate = (direction) => async (context) => {
  try {
    context.logger.emit('prepared_to_migrate', 'info', { direction })

    if (direction === 'up' && context.env.DB_CONNECTION_STRING) {
      const completed = []

      // execute the migrations that were defined in compose-domains.js
      while (context.migrations.length) {
        const migration = context.migrations.shift()
        completed.push({
          domain: migration.domain,
          up: await migration.migrate.up(),
        })
      }
      context.logger.emit('migrated_up', 'trace', completed)
    } else if (direction === 'down' && context.env.DB_CONNECTION_STRING) {
      const completed = []

      // execute the migrations that were defined in compose-domains.js
      while (context.migrations.length) {
        const migration = context.migrations.shift()
        completed.push({
          domain: migration.domain,
          down: await migration.migrate.down(),
        })
      }
      context.logger.emit('migrated_down', 'trace', completed)
    } else {
      context.logger.emit('migration_skipped', 'trace', { direction })
    }

    return context
  } catch (e) {
    throw new StartupError('compose_migrate_failed', e)
  }
}

module.exports = migrate
