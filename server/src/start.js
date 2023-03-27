import StartupError from './StartupError.js'

/**
 * Start listening on the configured port, and track any startup completion metrics
 * @param {IAppContext} context the context produced by `bootstrap`
 * @returns {Promise<IAppContext>}
 */
export const start = async (context) => {
  try {
    const { app, env } = context

    if (!app) {
      throw new Error('Expected the koa app to be defined on the app context')
    }

    app.listen(env.SERVER_PORT)
    context.logger.emit('startup', 'info', {
      message: 'app is listening',
      SERVER_PORT: env.SERVER_PORT,
      NODE_ENV: env.NODE_ENV,
      SERVER_VERSION: env.SERVER_VERSION,
    })

    return context
  } catch (/** @type {any} */ e) {
    throw new StartupError('start_failed', e)
  }
}
