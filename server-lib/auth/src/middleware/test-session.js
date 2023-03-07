/**
 * Checks to see if the request includes an active session
 * and returns a response with a boolean answer (e.g.
 * { authenticated: true|false })
 * @returns {IKoaMiddleware}
 */
export const testSession = () => async (ctx) => {
  const { logger } = ctx.state

  try {
    const authenticated = ctx.state && Object.keys(ctx.state).includes('session')
    logger.emit('test_session_exists', 'debug', { authenticated })

    ctx.response.status = 200
    ctx.response.body = { authenticated }
  } catch (err) {
    logger.emit('test_session_failure', 'error', { err })
    throw new Error('Failed to check the request session')
  }
}

export default testSession
