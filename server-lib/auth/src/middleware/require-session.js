/**
 * Middleware that stops processing the request if a session isn't present
 * Usage:
 *   context.routes.push((router) =>
 *     router.get(
 *       '/users',
 *       requireSession,
 *       listUsers)
 *   )
 * @type {import('koa').Middleware<IKoaContextState>}
 */
export const requireSession = async (ctx, next) => {
  const { logger } = ctx.state

  try {
    const authenticated = ctx.state && Object.keys(ctx.state).includes('session')

    if (authenticated) {
      logger.emit('required_session_found', 'trace')
      return next()
    } else {
      logger.emit('required_session_not_found', 'trace')
      ctx.response.status = 404
    }
  } catch (err) {
    logger.emit('required_session_failure', 'error', { err })
    throw new Error('Failed to check the request session')
  }
}

export default requireSession
