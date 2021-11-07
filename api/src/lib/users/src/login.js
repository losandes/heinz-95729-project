/**
 * @param {jsonwebtoken} jwt
 */
function LoginFactory (deps) {
  'use strict'

  const { jwt } = deps

  /**
   * @param {/^(local|test|development|production)$/} env.NODE_ENV - the environment this is running in
   * @param {object} env.NODE_ENV_OPTIONS - the environments this app supports (i.e. env.NODE_ENV_OPTIONS.LOCAL)
   * @param {string} env.JWT_COOKIE_NAME - the name of the cookie this module will add to the response
   * @param {string} env.JWT_SECRET - a 256bit secret to sign the JWT with (i.e. 32char utf8 string)
   * @param {string} env.JWT_EXPIRES_IN - the time to live for the JWT in [vercel/ms](https://github.com/vercel/ms)
   * @param {number} env.JWT_EXPIRES_IN_MS - the number of milliseconds in the future cookies/jwts should expire
   * @param {UserPgRepo} userRepo
   */
  function Login (input) {
    const { userRepo } = input
    const {
      NODE_ENV, // /^(local|test|development|production)$/
      NODE_ENV_OPTIONS,
      JWT_COOKIE_NAME,
      JWT_SECRET,
      JWT_EXPIRES_IN,
      JWT_EXPIRES_IN_MS,
    } = input.env

    /**
     * Sign a user in
     */
    const login = (makeRedirect) => async (ctx) => {
      const logger = ctx.request.state.logger

      try {
        const user = await userRepo.get.byEmail(ctx.request.body.email)

        if (user) {
          logger.emit('user_login_success', 'debug', { id: user.id, user })
          logger.emit('user_login_success', 'audit_info', { affectedUserId: user.id })

          const token = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN })

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
        logger.emit('user_login_failure', 'error', { err })
        throw new Error('Failed to sign the user in')
      }
    }

    const authorize = (redirectURL) => async (ctx) => {
      ctx.response.body = '<html>' +
        `\n<meta http-equiv="refresh" content="0; URL=${redirectURL}">` +
        '\n<body>' +
        '\n  <h1>Success! Redirecting to the App...</h1>' +
        `\n  <button onClick="window.location = '${redirectURL}'">Click here to redirect</button>` +
      '\n</body></html>'
      ctx.response.set('Content-Type', 'text/html')
      ctx.response.status = 200
    }

    return { login, authorize }
  }

  return { Login }
}

module.exports = LoginFactory
