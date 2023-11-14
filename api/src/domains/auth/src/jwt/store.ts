import type { Context } from 'koa'
import type sessionSchema from '../typedefs/session'

/**
 * Persists the session in the database
 */
export const store = (ctx: Context) => async (session: sessionSchema) => {
  const { logger } = ctx.state

  // TODO: add a session to the database

  const gauge = {
    sessionId: session.id,
    labels: 'session',
    direction: 'increase',
    help: 'tracks the number of active sessions',
  }

  logger.emit('session_created', 'gauge', gauge)
  logger.emit('session_created', 'gauge_increase', gauge)
}

export default store
