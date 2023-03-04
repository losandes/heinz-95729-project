import StartupError from './StartupError.js'

/**
 * Start listening on the configured port, and track any startup completion metrics
 * @param {any} context the context produced by `bootstrap`
 */
export const start = async (context) => {
  try {
    const { app, env } = context
    app.listen(env.PORT)
    context.logger.emit('startup', 'info', {
      message: 'app is listening',
      PORT: env.PORT,
      NODE_ENV: env.NODE_ENV,
      APP_VERSION: env.APP_VERSION,
    })

    return context
  } catch (/** @type {any} */ e) {
    throw new StartupError('start_failed', e)
  }
}
