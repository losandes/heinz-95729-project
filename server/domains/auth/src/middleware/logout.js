import { verify as _verify } from '../jwt/verify.js'
import { revoke as _revoke } from '../jwt/revoke.js'

/**
 * Generates a Koa middleware that signs the user out
 * (via a cookie overwrite) and redirects them to the
 * location produced by the _makeRedirect_ param
 * @param {(ctx: IKoaContext) => string} makeRedirect
 * @param {{
 *   verify: (ctx: IKoaContext) => (token: string | undefined) => Promise<ISession | undefined>,
 *   revoke: (ctx: IKoaContext<any>) => (session: ISession | undefined) => Promise<void>
 * }} dependencies
 * @returns {IKoaMiddleware}
 */
export const logout = (
  makeRedirect,
  dependencies = { verify: _verify, revoke: _revoke },
) => async (ctx) => {
  const { env, logger } = ctx.state
  const { verify, revoke } = dependencies
  const {
    NODE_ENV_ENFORCE_SECURITY,
    SESSIONS_COOKIE_NAME,
  } = env

  try {
    const session = await verify(ctx)(ctx.cookies.get(env.SESSIONS_COOKIE_NAME))
    await revoke(ctx)(session)

    ctx.cookies.set(SESSIONS_COOKIE_NAME, 'expired', {
      maxAge: -99999999,     // will expire in (e.g. 30 days)
      sameSite: 'lax',       // limit the scope of the cookie to this site, but allow top level redirects
      path: '/',             // set the relative path that the cookie is scoped for
      secure: NODE_ENV_ENFORCE_SECURITY, // only support HTTPS connections
      httpOnly: true,        // dissallow client-side access to the cookie
      overwrite: true,       // overwrite the cookie every time, so nonce data is never re-used
    })

    ctx.response.status = 302
    ctx.response.redirect(makeRedirect(ctx))
    logger.emit('logout_success', 'debug')
  } catch (err) {
    logger.emit('logout_failure', 'error', { err })
    throw new Error('Failed to sign the user in')
  }
}

export default logout
