import { RateLimiterMemory } from 'rate-limiter-flexible'
const limiter = new RateLimiterMemory({
  points: 10, // 10 requests for ctx.ip
  duration: 1, // per 1 second
})

/**
 * Adds a rate limiter to the requests to respond to DNOS attacks.
 * Ideally, this will be managed by a WAF in production, but
 * consider using this as a fallback in case that isn't configured.
 *
 * NOTE that this has the potential to log IP addresses, so it has
 * regulatory impact on the application that needs to be considered
 * before production use.
 *
 * NOTE this is configured to use an in-memory limiter. In
 * horizontally scaled deployments, a centralized limiter should be
 * used instead (e.g. RateLimiterRedis)
 * @returns {import('koa').Middleware<IKoaContextState>}
 */
export const rateLimiter = () => async (ctx, next) => {
  try {
    await limiter.consume(ctx.ip)
  } catch (rejRes) {
    ctx.state.logger.emit('rate_limited', 'warn', { ip: ctx.ip })
    ctx.status = 429
    ctx.body = { message: 'Too Many Requests' }
    // or you can throw an exception
    // ctx.throw(429, 'Too Many Requests')
    return
  }

  await next()
}

export default rateLimiter
