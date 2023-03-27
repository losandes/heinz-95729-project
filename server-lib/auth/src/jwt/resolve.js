import { revoke } from './revoke.js'

/**
 * Persists the session in the database
 * @param {IKoaContext} ctx
 * @returns {(session: ISession) => Promise<string | undefined>}
 */
export const resolve = (ctx) => async (session) => {
  // TODO: get a session from the database and check that it hasn't expired
  const expired = false

  if (expired) {
    await revoke(ctx)(session)
    return session.id
  } else {
    return session.id
  }
}

export default resolve
