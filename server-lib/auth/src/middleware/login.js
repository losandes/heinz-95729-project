import jwt from 'jsonwebtoken'
import Session from '../typedefs/Session.js'

/**
 * Generates a Koa middleware that signs the user in
 * (via a cookie) and redirects them to the location
 * produced by the _makeRedirect_ param
 * @param {(ctx: IKoaContext) => string} makeRedirect
 * @returns {IKoaRoute}
 */
export const login = (makeRedirect) => async (ctx) => {
  const { env, logger, resolvers } = ctx.state
  const {
    NODE_ENV, // /^(local|test|development|production)$/
    NODE_ENV_OPTIONS,
    JWT_COOKIE_NAME,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_EXPIRES_IN_MS,
  } = env

  try {
    logger.emit('before_login', 'local', {
      requestBody: ctx.request.body,
      rawBody: ctx.request.rawBody,
    })

    /** @type {IResolveUsers} */
    const users = resolvers.users
    const email = /** @type {any} */ (ctx.request.body)?.email
    let user

    if (typeof email === 'string') {
      user = await users.getBy.email(email)
    }

    if (user) {
      const session = new Session({
        id: user.id,
        email: user.email,
        name: user.name,
      })

      logger.emit('login_success', 'debug')
      logger.emit('login_success', 'audit_info', { session })

      const token = jwt.sign(session.toObject(), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

      ctx.cookies.set(JWT_COOKIE_NAME, token, {
        maxAge: JWT_EXPIRES_IN_MS, // will expire in 30 days
        sameSite: 'lax', // limit the scope of the cookie to this site, but allow top level redirects
        path: '/', // set the relative path that the cookie is scoped for
        secure: NODE_ENV !== NODE_ENV_OPTIONS.LOCAL, // only support HTTPS connections
        httpOnly: true, // dissallow client-side access to the cookie
        overwrite: true, // overwrite the cookie every time, so nonce data is never re-used
      })

      ctx.response.status = 302
      ctx.response.redirect(makeRedirect(ctx))
    } else {
      ctx.response.status = 404
    }
  } catch (err) {
    logger.emit('login_failure', 'error', { err })
    throw new Error('Failed to sign the user in')
  }
}

export default login
