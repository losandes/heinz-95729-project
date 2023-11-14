import type { Next, ParameterizedContext } from 'koa'
import type { reqCtxSchema } from '../../../../server'

/**
 * Middleware that stops processing the request if a session isn't present
 *
 * @example
 * ```ts
 * router.get(
 *   '/some/protected/route',
 *   requireSession(),
 *   (ctx) => {}
 * )
 * ```
 */
export const requireSession = () => async (
  ctx: ParameterizedContext<reqCtxSchema>,
  next: Next
) => {
  const { logger } = ctx.state

  try {
    const authenticated = typeof ctx.state === 'object' &&
      typeof ctx.state.session !== 'undefined' &&
      ctx.state.session !== null

    ctx.response.status = authenticated ? 200 : 404

    logger.emit('session_required_complete', 'trace', { authenticated })
    return next()
  } catch (err) {
    logger.emit('session_required_failed', 'error', { err })
    throw new Error('Failed to check the request session')
  }
}

export default requireSession
