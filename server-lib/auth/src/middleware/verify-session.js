import jwt from 'jsonwebtoken'
import Session from '../typedefs/Session.js'

/**
 * @type {import('koa').Middleware<IKoaContextState>}
 */
export const verifySession = async (ctx, next) => {
  const { env, logger } = ctx.state
  const {
    JWT_COOKIE_NAME,
    JWT_SECRET,
  } = env

  try {
    const token = ctx.cookies.get(JWT_COOKIE_NAME)

    if (typeof token === 'string') {
      const session = jwt.verify(token, JWT_SECRET)

      if (typeof session === 'string') {
        logger.emit('user_session_not_present', 'local', { session: token })
        return
      }

      ctx.state.session = new Session(session)
      logger.emit('user_session_verification_success', 'local', { session: ctx.state.session })
    } else {
      logger.emit('user_session_not_present', 'local', { session: token })
    }
  } catch (err) {
    logger.emit('user_session_verification_failure', 'error', { err })
    throw new Error('Failed to sign the user in')
  }

  await next()
}

export default verifySession
