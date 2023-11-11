import jsonwebtoken from 'jsonwebtoken'

const jwt = {
  /**
   * @param {string | object | Buffer} payload
   * @param {import('jsonwebtoken').Secret} secret
   * @param {import('jsonwebtoken').SignOptions} signOptions
   * @returns
   */
  sign: (payload, secret, signOptions) => new Promise((resolve, reject) =>
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
 * @param {IKoaContext} ctx
 * @returns {(session: ISession) => Promise<string>}
 */
export const sign = (ctx) => async (session) => {
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

  logger.emit('jwt_signed', 'local', jsonwebtoken.decode(signed))

  return signed
}

export const forTesting = { jwt }
export default sign
