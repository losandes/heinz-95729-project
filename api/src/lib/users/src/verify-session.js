/**
 * @param {@polyn/blueprint} blueprint
 * @param {jsonwebtoken} jwt
 */
function VerifySessionFactory (deps) {
  'use strict'

  const { jwt } = deps
  const { is } = deps.blueprint

  /**
   * @param {string} env.JWT_COOKIE_NAME - the name of the cookie this module will add to the response
   * @param {string} env.JWT_SECRET - a 256bit secret to sign the JWT with (i.e. 32char utf8 string)
   */
  function VerifySession (input) {
    const {
      JWT_COOKIE_NAME,
      JWT_SECRET,
    } = input.env

    /**
     * Sign a user in
     */
    const verifySession = async (ctx, next) => {
      const logger = ctx.request.state.logger

      try {
        const token = ctx.cookies.get(JWT_COOKIE_NAME)

        if (is.string(token)) {
          ctx.state = ctx.state || {}
          ctx.state.session = await jwt.verify(token, JWT_SECRET)
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

    return { verifySession }
  }

  return { VerifySession }
}

module.exports = VerifySessionFactory
