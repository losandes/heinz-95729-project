/**
 * Generates a Koa middleware that signs the user out
 * (via a cookie overwrite) and redirects them to the
 * location produced by the _makeRedirect_ param
 * @param {(ctx: IKoaContext) => string} makeRedirect
 * @returns {IKoaMiddleware}
 */
export const logout = (makeRedirect) => async (ctx) => {
  const { env, logger } = ctx.state
  const {
    NODE_ENV, // /^(local|test|development|production)$/
    NODE_ENV_OPTIONS,
    JWT_COOKIE_NAME,
  } = env

  try {
    ctx.cookies.set(JWT_COOKIE_NAME, 'expired', {
      maxAge: -99999999,
      sameSite: 'lax', // limit the scope of the cookie to this site, but allow top level redirects
      path: '/', // set the relative path that the cookie is scoped for
      secure: NODE_ENV !== NODE_ENV_OPTIONS.LOCAL, // only support HTTPS connections
      httpOnly: true, // dissallow client-side access to the cookie
      overwrite: true, // overwrite the cookie every time, so nonce data is never re-used
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
