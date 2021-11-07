const StartupError = require('./StartupError.js')

/**
 * Test any dependencies the API has (i.e. database connections, etc.)
 * NOTE: this function is executed on startup, and by the '/health' route
 * @param context the context produced by `bootstrap`
 */
const test = async (context) => {
  try {
    context.logger.emit('products_count', 'debug', {
      products_count: await context.knex('products').count('id'),
    })

    context.logger.emit('startup_test_complete', 'info', { db: 'postgres' })
    return context
  } catch (e) {
    throw new StartupError('test_failed', e)
  }
}

module.exports = test
