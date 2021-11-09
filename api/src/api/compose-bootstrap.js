const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const { LogEmitter, writers, formatters } = require('@polyn/logger')
const dotenv = require('dotenv')
const db = require('knex')
const path = require('path')
const pkg = require('../../package.json')

const { Envvars } = require('./env')({ blueprint, immutable })
const exit = require('./compose-exit.js')
const StartupError = require('./StartupError.js')

/**
 * Starts a promise chain and creates the context for the app. The context
 * will get returned by each step in the flow
 * @param context optional context object
 */
const bootstrap = async (context) => {
  try {
    process.on('uncaughtException', exit)
    process.on('unhandledRejection', exit)

    dotenv.config({ path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env') })

    context = { ...context }
    context.env = new Envvars({ ...process.env, ...context.env, ...{ APP_VERSION: pkg.version } })
    context.logger = context.logger || new LogEmitter()
    context.logWriter = context.logWriter || new writers[context.env.LOG_WRITER]({
      formatter: new formatters[context.env.LOG_FORMATTER](),
    })
    context.env.LOG_LISTENERS.forEach((event) =>
      context.logger.on(event, context.logWriter.listen),
    )
    context.domains = context.domains || {}

    if (!context.knex) {
      const knex = db({
        client: 'pg',
        connection: process.env.DB_CONNECTION_STRING,
        migrations: {
          tableName: 'z_migrations_default',
        },
      })

      context.knex = knex
    }

    context.logger.emit('bootstrap_complete', 'trace', 'bootstrap_complete')

    return context
  } catch (e) {
    throw new StartupError('bootstrap_failed', e)
  }
} // /bootstrap

module.exports = bootstrap
