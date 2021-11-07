/**
 */
function GetProfileFactory (deps) {
  'use strict'

  /**
   * Gets a user's profile
   */
  function GetProfile () {
    const getProfile = async (ctx) => {
      const logger = ctx.request.state.logger

      if (ctx.state && ctx.state.session) {
        ctx.response.body = ctx.state.session
        logger.emit('user_profile_get_success', 'local', { session: ctx.state.session })
      } else {
        logger.emit('user_profile_get_not_found', 'local', { session: null })
        ctx.response.status = 404
      }
    }

    return { getProfile }
  }

  return { GetProfile }
}

module.exports = GetProfileFactory
