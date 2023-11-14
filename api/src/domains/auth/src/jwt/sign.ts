import jsonwebtoken, { type Secret, type SignOptions } from 'jsonwebtoken'
import type { Context } from 'koa'
import type sessionSchema from '../typedefs/session'

const jwt = {
  sign: (
    payload: string | object | Buffer,
    secret: Secret,
    signOptions: SignOptions,
  ) => new Promise((resolve, reject) =>
    jsonwebtoken.sign(payload, secret, signOptions, (err, result) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(result)
      }
    }),
  ),
}

/**
 * Signs a session object into a JWT
 */
export const sign = (ctx: Context) => async (session: sessionSchema) => {
  const { env, logger } = ctx.state
  const {
    SERVER_ORIGIN,
    SESSIONS_ALGORITHM,
    SESSIONS_SECRETS,
    SESSIONS_EXPIRE_IN_S,
  } = env

  /**
   * Always sign with the first secret... it should be the freshest.
   * The other secrets are for verification only and will expire soon.
   * This is to support secret rotation
   */
  const { KID, SECRET } = SESSIONS_SECRETS[0]

  const signed = await jwt.sign(session, SECRET, {
    algorithm: SESSIONS_ALGORITHM,
    issuer: SERVER_ORIGIN,
    keyid: KID,
    expiresIn: SESSIONS_EXPIRE_IN_S,
    subject: `local|${session.id}`,
  })

  logger.emit('jwt_signed', 'local', jsonwebtoken.decode(signed as string))

  return signed
}

export const forTesting = { jwt }
export default sign
