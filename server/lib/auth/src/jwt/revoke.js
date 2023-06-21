/**
 * Invalidates or removes the session from the database
 * @param {IKoaContext} ctx
 * @returns {(session: ISession | undefined) => Promise<void>}
 */
export const revoke = (ctx) => async (session) => {
  const { logger } = ctx.state

  if (!session) {
    return
  }

  // TODO: remove the session from the database

  const gauge = {
    sessionId: session.id,
    labels: 'session',
    direction: 'decrease',
    help: 'tracks the number of active sessions',
  }

  logger.emit('session_revoked', 'gauge', gauge)
  logger.emit('session_revoked', 'gauge_decrease', gauge)
}

export default revoke
