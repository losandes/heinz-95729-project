import jsonwebtoken from 'jsonwebtoken'
import { resolve } from './resolve.js'
import sessionSchema from '../typedefs/session.js'

/**
 * @curried
 * @param {IKoaContext} ctx
 * @returns {{ findSecret: import('jsonwebtoken').GetPublicKeyOrSecret }}
 */
const withCtx = (ctx) => {
  const { env } = ctx.state
  const { SESSIONS_SECRETS } = env

  return {
    /**
     * Finds the signing key among the SESSIONS_SECRETS envvar, if it exists and
     * hasn't expired
     * @param {import('jsonwebtoken').JwtHeader} header
     * @param {import('jsonwebtoken').SigningKeyCallback} callback
     */
    findSecret: (header, callback) => {
      const maybeSecret = SESSIONS_SECRETS.find(({ kid }) => header.kid === kid)
      const isExpired = typeof maybeSecret?.expiration === 'number' && Date.now() > maybeSecret.expiration

      if (isExpired) {
        return callback(new Error(`The secret with kid, "${header.kid}", is no longer valid`))
      } else if (maybeSecret) {
        return callback(null, maybeSecret.secret)
      } else {
        return callback(new Error(`A secret with kid, "${header.kid}", was not found`))
      }
    },
  }
}

const jwt = {
  /**
   * Verifies that the token found in the cookie was signed with a valid
   * signing key
   * @param {string} token
   * @param {import('jsonwebtoken').GetPublicKeyOrSecret} findSecret
   * @returns {Promise<string | import('jsonwebtoken').JwtPayload | undefined>}
   */
  verify: (token, findSecret) => new Promise((resolve, reject) =>
    jsonwebtoken.verify(token, findSecret, (err, result) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(result)
      }
    }),
  ),
}

/**
 * Verifies that a token found in the cookie, that it was signed with a valid
 * signing key, and that the session is valid (as in tracked in the database
 * and not revoked)
 * @param {IKoaContext} ctx
 * @returns {(token: string | undefined) => Promise<ISession | undefined>}
 */
export const verify = (ctx) => async (token) => {
  const { logger } = ctx.state

  if (typeof token !== 'string') {
    return
  }

  const verified = await jwt.verify(token, withCtx(ctx).findSecret)

  if (!verified || typeof verified === 'string') {
    logger.emit('user_session_not_present', 'local', { session: token })
    return
  }

  const session = sessionSchema.parse(verified)
  const stored = await resolve(ctx)(session)

  logger.emit('jwt_verification_complete', 'local', { session, stored })

  if (stored) {
    return session
  }
}

export const forTesting = { jwt, withCtx }
export default verify
