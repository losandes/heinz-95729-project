/**
 * Wraps the request with metrics gathering
 * IMPORTANT! this depends on the `ctx.state` already being established
 * IMPORTANT! this should run early in the middleware stack to capture
 * the duration/latency of each request
 * @see https://github.com/losandes/polyn-logger#tracking-performance-and-metrics
 * @returns {import('koa').Middleware<IKoaContextState>}
 */
export const gatherRequestMetrics = () => async (ctx, next) => {
  await ctx.state.logger.tryWithMetrics({
    name: 'api_request',
    labels: {
      method: ctx.request.method,
      url: ctx.request.url.split('?')[0],
    },
  // @ts-ignore
  })(next)
}

export default gatherRequestMetrics
