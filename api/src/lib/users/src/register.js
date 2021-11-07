/**
 *
 */
function RegisterFactory (deps) {
  'use strict'

  /**
   * @param {ENVVARs} env - The values from process.env or env.js
   */
  function Register (input) {
    const { userRepo, login } = input

    /**
     * Sign a user in
     */
    const register = (makeRedirect) => async (ctx) => {
      const logger = ctx.request.state.logger

      try {
        // TODO: check to make sure the user doesn't already exist
        const user = await userRepo.upsert(ctx.request.body)

        logger.emit('user_register_success', 'debug', { id: user.id, user })
        logger.emit('user_register_success', 'audit_info', { affectedUserId: user.id })

        return login(makeRedirect)(ctx)
      } catch (err) {
        logger.emit('user_register_error', 'error', { err })
        throw new Error('Failed to register user')
      }
    }

    return { register }
  }

  return { Register }
}

module.exports = RegisterFactory
