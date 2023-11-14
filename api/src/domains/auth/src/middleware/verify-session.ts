import type { Next, ParameterizedContext } from 'koa'
import { verify } from '../jwt/verify.js'
import type { reqCtxSchema } from '../../../../server'

/**
 * Verifies the user's session and adds it to the ctx.state if it exists
 */
export const verifySession = () => async (
  ctx: ParameterizedContext<reqCtxSchema>,
  next: Next
) => {
  const { env, logger } = ctx.state

  try {
    ctx.state.session = await verify(ctx)(ctx.cookies.get(env.SESSIONS_COOKIE_NAME))
    logger.emit('user_session_verification_complete', 'local', { session: ctx.state.session })
  } catch (err) {
    logger.emit('user_session_verification_failure', 'error', { err })
    throw new Error('Failed to sign the user in')
  }

  await next()
}

export default verifySession
