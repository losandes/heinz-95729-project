/**
 * Persists the session in the database
 * @param {IKoaContext} ctx
 * @returns {(session: ISession) => Promise<void>}
 */
export const store = (ctx) => async (session) => {
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
