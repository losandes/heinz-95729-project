import StartupError from './StartupError.js'

/**
 * Test any dependencies the API has (i.e. database connections, etc.)
 * NOTE: this function is executed on startup, and by the '/health' route
 * @param {any} context the context produced by `bootstrap`
 */
export const verify = async (context) => {
  try {
    // TODO: check for required inter-system dependencies, such as database and cache connections

    context.logger.emit('startup_verify_complete', 'info', { })
    return context
  } catch (/** @type {any} */ e) {
    throw new StartupError('verify_failed', e)
  }
}
