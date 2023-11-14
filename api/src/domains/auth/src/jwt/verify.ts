import jsonwebtoken, {
  type GetPublicKeyOrSecret,
  type JwtHeader,
  type SigningKeyCallback,
} from 'jsonwebtoken'
import { type ParameterizedContext } from 'koa'
import { resolve } from './resolve.js'
import sessionSchema from '../typedefs/session.js'
import type { reqCtxSchema } from '../../../../server/src/typedefs/ctx-req-lifecycle.js'

/**
 * @curried
 */
const withCtx = (ctx: ParameterizedContext<reqCtxSchema>) => {
  const { env } = ctx.state
  const { SESSIONS_SECRETS } = env

  return {
    /**
     * Finds the signing key among the SESSIONS_SECRETS envvar, if it exists and
     * hasn't expired
     */
    findSecret: (header: JwtHeader, callback: SigningKeyCallback) => {
      const maybeSecret = SESSIONS_SECRETS.find(({ KID }) => header.kid === KID)
      const isExpired = typeof maybeSecret?.EXPIRATION === 'number' && Date.now() > maybeSecret.EXPIRATION

      if (isExpired) {
        return callback(new Error(`The SECRET with KID, "${header.kid}", is no longer valid`))
      } else if (maybeSecret) {
        return callback(null, maybeSecret.SECRET)
      } else {
        return callback(new Error(`A SECRET with KID, "${header.kid}", was not found`))
      }
    },
  }
}

const jwt = {
  /**
   * Verifies that the token found in the cookie was signed with a valid
   * signing key
   */
  verify: (
    token: string, findSecret: GetPublicKeyOrSecret
  ) => new Promise((resolve, reject) =>
    jsonwebtoken.verify(token, findSecret, (err, result) =>
      err
        ? reject(err)
        : resolve(result)
    ),
  ),
}

/**
 * Verifies that a token found in the cookie, that it was signed with a valid
 * signing key, and that the session is valid (as in tracked in the database
 * and not revoked)
 */
export const verify = (
  ctx: ParameterizedContext<reqCtxSchema>
) => async (token: unknown) => {
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
  } else {
    return
  }
}

export const forTesting = { jwt, withCtx }
export default verify
