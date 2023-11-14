import type { Context } from 'koa'
import { revoke } from './revoke.js'
import type sessionSchema from '../typedefs/session.js'

/**
 * Persists the session in the database
 */
export const resolve = (ctx: Context) => async (session: sessionSchema) => {
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
