import { createId } from '@paralleldrive/cuid2'
import sessionSchema from '../typedefs/session.js'
import { sign } from '../jwt/sign.js'
import { store } from '../jwt/store.js'

/**
 * Generates a Koa middleware that signs the user in
 * (via a cookie) and redirects them to the location
 * produced by the _makeRedirect_ param
 * @param {(ctx: IKoaContext) => string} makeRedirect
 * @returns {IKoaMiddleware}
 */
export const login = (makeRedirect) => async (ctx) => {
  const { env, logger, resolvers } = ctx.state
  const {
    NODE_ENV_ENFORCE_SECURITY,
    SESSIONS_COOKIE_NAME,
    SESSIONS_EXPIRE_IN_MS,
  } = env

  try {
    logger.emit('before_login', 'local', {
      requestBody: ctx.request.body,
      rawBody: ctx.request.rawBody,
    })

    const email = /** @type {any} */ (ctx.request.body)?.email
    const user = typeof email === 'string'
      ? await /** @type {IResolveUsers} */ (resolvers.users).getBy.email(email)
      : undefined

    if (!user) {
      ctx.response.status = 404
      return
    }

    const session = sessionSchema.parse({
      id: user.id,
      email: user.email,
      name: user.name,
      nonce: createId(),
    })

    logger.emit('login_success', 'debug')
    logger.emit('login_success', 'audit_info', { session })

    const token = await sign(ctx)(session)
    await store(ctx)(session)

    ctx.cookies.set(SESSIONS_COOKIE_NAME, token, {
      maxAge: SESSIONS_EXPIRE_IN_MS, // will expire in (e.g. 30 days)
      sameSite: 'lax',           // limit the scope of the cookie to this site, but allow top level redirects
      path: '/',                 // set the relative path that the cookie is scoped for
      secure: NODE_ENV_ENFORCE_SECURITY,     // only support HTTPS connections
      httpOnly: true,            // dissallow client-side access to the cookie
      overwrite: true,           // overwrite the cookie every time, so nonce data is never re-used
    })

    ctx.response.status = 302
    ctx.response.redirect(makeRedirect(ctx))
  } catch (err) {
    logger.emit('login_failure', 'error', { err })
    throw new Error('Failed to sign the user in')
  }
}

export default login
