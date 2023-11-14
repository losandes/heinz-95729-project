import type { Context } from 'koa'

export const onError = (err: unknown, ctx: Context) => {
  /**
   * prefer the ctx.state.logger because it has an affinity id
   * to help us read the logs in context of the other logs for
   * the same request, but fallback to the app's context.logger
   * to make sure we have the logs
   */
  const logger = ctx.state && ctx.state.logger && typeof ctx.state.logger.emit === 'function'
    ? ctx.state.logger
    : { emit: console.log }

  logger.emit('uncaught_koa_error', 'error', { err })
}

export default onError
