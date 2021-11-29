const bodyparser = require('koa-bodyparser')
const cors = require('@koa/cors')
const { randomBytes } = require('crypto')
const helmet = require('koa-helmet')
const Koa = require('koa')
const Router = require('koa-router')
const { e500 } = require('@robotsandpencils/koa-errors')
const test = require('./compose-test.js')
const StartupError = require('./StartupError.js')

/**
 * Creates an instance of Koa, and the default router
 * @param context the context produced by `bootstrap`
 */
const app = async (context) => {
  try {
    const app = new Koa()
    app.proxy = context.env.APP_IS_IN_PROXY
    const router = new Router()

    app.on('error', (err, ctx) => {
      if (ctx.state && ctx.state.logger && typeof ctx.state.logger.emit === 'function') {
        ctx.state.logger.emit('uncaught_koa_error', 'error', { err })
      }
    })

    app.use(e500({
      showStack: context.env.NODE_ENV === context.env.NODE_ENV_OPTIONS.LOCAL,
    }))

    /**
     * Request context
     * Adds `locals` object to express for context that can be shared to
     * functions that get called by routes. Includes a logger with request
     * context already added to it
     */
    app.use(async (ctx, next) => {
      const reqContext = {
        affinityId: randomBytes(4).toString('hex'),
        method: ctx.request.method,
        url: ctx.request.url.split('?')[0],
        origin: ctx.get('Origin'), // i.e. http://localhost:3001
      }
      ctx.request.state = { ...ctx.request.state, ...reqContext }
      ctx.request.state.logger = context.logger.child({ context: reqContext })
      ctx.request.state.logger.emit('api_req_received', 'debug', reqContext)
      await next()
    })

    /**
     * put the user's cookie/session on the context
     */
    app.use(context.domains.users.verifySession)

    /**
     * Wrap the request with metrics gathering
     * @see https://github.com/losandes/polyn-logger#tracking-performance-and-metrics
     */
    app.use(async (ctx, next) => {
      await ctx.request.state.logger.tryWithMetrics({
        name: 'api_request',
        labels: {
          method: ctx.request.method,
          url: ctx.request.url.split('?')[0],
        },
      })(next)
    })

    /**
     * CORS middleware
     *
     * DEFAULT (no options passed):
     *   origin: request Origin header
     *   allowMethods: GET,HEAD,PUT,POST,DELETE,PATCH
     *
     * @param {Object} [options]
     *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
     *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
     *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
     *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
     *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
     *  - {Boolean|Function(ctx)} credentials `Access-Control-Allow-Credentials`, default is false.
     *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
     * @return {Function} cors middleware
     * @api public
     */
    app.use(cors({
      origin: context.env.CORS_ORIGIN,
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
      allowHeaders: ['Authorization', 'Accepts', 'Content-Type', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Unmodified-Since', 'Range', 'X-Requested-With', 'X-Request-ID'],
      exposeHeaders: ['Content-Length', 'Date', 'ETag', 'Expires', 'Last-Modified', 'X-Powered-By', 'X-Request-ID', 'X-heinz-95729-Media-Type'],
      maxAge: 120,
      credentials: true,
    }))
    app.use(helmet.hsts({
      maxAge: 31536000,           // Must be at least 1 year to be approved by Google
      includeSubDomains: true,    // Must be enabled to be approved by Google
      preload: true,
    }))
    app.use(helmet.dnsPrefetchControl())
    app.use(helmet.frameguard({ action: 'deny' }))
    app.use(helmet.xssFilter())
    app.use(helmet.ieNoOpen())
    app.use(helmet.noSniff())
    app.use(async (ctx, next) => {
      // nocache
      ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
      ctx.set('Pragma', 'no-cache')
      ctx.set('Expires', 0)
      await next()
    })
    app.use(helmet.hidePoweredBy())
    // TODO: add csp
    app.use(bodyparser())

    context.health = {
      NODE_ENV: context.env.NODE_ENV,
      APP_VERSION: context.env.APP_VERSION,
    }
    router.get('/health', async (ctx) => {
      try {
        await test(context)
        ctx.response.status = 200
        ctx.body = context.health
      } catch (err) {
        ctx.request.state.logger.emit('health_check_failed', 'error', context.health)
        ctx.response.status = 502
        ctx.body = context.health
      }
    })

    /**
     * register the routes that were defined in compose-domains.js
     */
    context.routes.forEach((registerRoute) => registerRoute(router))

    app.use(router.routes())
    context.app = app
    context.router = router

    context.logger.emit('compose_app_complete', 'trace', 'compose_app_complete')
    return context
  } catch (e) {
    throw new StartupError('compose_app_failed', e)
  }
} // /compose.app

module.exports = app
