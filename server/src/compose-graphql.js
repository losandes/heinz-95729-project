import { randomBytes } from 'node:crypto'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import Router from 'koa-router'
import cors from '@koa/cors'
import * as koaErrorsPkg from '@robotsandpencils/koa-errors'
import { createYoga, createSchema } from 'graphql-yoga'
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection'
import loadTypeDefs from '../schema/index.js'
import StartupError from './StartupError.js'

const { e500 } = koaErrorsPkg

/**
 * Creates an instance of Koa, and the default router
 * @param {any} context the context produced by `bootstrap`
 */
export const composeApp = async (context) => {
  try {
    const app = new Koa()
    app.proxy = context.env.APP_IS_IN_PROXY
    const router = app.proxy
      ? new Router({ prefix: context.env.ROUTER_PREFIX })
      : new Router()

    app.on('error', (err, ctx) => {
      if (ctx.state && ctx.state.logger && typeof ctx.state.logger.emit === 'function') {
        ctx.state.logger.emit('uncaught_koa_error', 'error', { err })
      }
    })

    app.use(e500({
      showStack: context.env.NODE_ENV === context.env.NODE_ENV_OPTIONS.LOCAL,
    }))

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
      ctx.set('Expires', '0')
      await next()
    })
    app.use(helmet.hidePoweredBy())
    // TODO: add csp

    /**
     *
     * @param {IKoaContext} ctx
     * @returns {(resolverFactory: IDataResolverFactory) => void}
     */
    const addResolverToState = (ctx) => (resolverFactory) => {
      const resolver = resolverFactory(ctx)

      ctx.state.resolvers[resolver.name] = resolver
    }

    /**
     * Request context
     * Adds `locals` object to koa for context that can be shared to
     * functions that get called by routes. Includes a logger with request
     * context already added to it
     *
     * @param {(ctx: IKoaContext, next: Promise<void>) => Promise<void>} arg0
     */
    app.use(async (ctx, next) => {
      const reqContext = {
        affinityId: randomBytes(4).toString('hex'),
        method: ctx.request.method,
        url: ctx.request.url.split('?')[0],
        origin: ctx.get('Origin'), // i.e. http://localhost:3001
      }

      /** @type {IKoaContextState} */
      const state = {
        affinityId: reqContext.affinityId,
        method: reqContext.method,
        url: reqContext.url,
        origin: reqContext.origin,
        logger: context.logger.child({ context: reqContext }),
        env: context.env,
        storage: context.storage,
        resolvers: {},
      }

      ctx.state = { ...ctx.state, ...state }

      context.resolverFactories.forEach(addResolverToState(ctx))

      ctx.state.logger.emit('api_req_received', 'debug', reqContext)
      await next()
    })

    /**
     * Wrap the request with metrics gathering
     * @see https://github.com/losandes/polyn-logger#tracking-performance-and-metrics
     */
    app.use(async (ctx, next) => {
      await ctx.state.logger.tryWithMetrics({
        name: 'api_request',
        labels: {
          method: ctx.request.method,
          url: ctx.request.url.split('?')[0],
        },
      })(next)
    })

    /**
     * put the user's cookie/session on the context if it exists
     */
    // app.use(context.domains.auth.verifySession)

    /** @type {import('graphql-yoga').YogaServerOptions<{}, {}>} */
    const yogaConfig = {
      schema: createSchema({
        typeDefs: await loadTypeDefs(context),
      }),
      logging: {
        /** @param {any[]} args */
        debug (...args) {
          context.logger.emit('yoga_log', 'debug', { ...args })
        },
        /** @param {any[]} args */
        info (...args) {
          context.logger.emit('yoga_log', 'info', { ...args })
        },
        /** @param {any[]} args */
        warn (...args) {
          context.logger.emit('yoga_log', 'warn', { ...args })
        },
        /** @param {any[]} args */
        error (...args) {
          context.logger.emit('yoga_log', 'error', { ...args })
        },
      },
      cors: false,
      plugins: [],
    }

    if (context.env.NODE_ENV !== context.env.NODE_ENV_OPTIONS.LOCAL) {
      yogaConfig.graphiql = false
      yogaConfig.plugins?.push(useDisableIntrospection({
        isDisabled: (request) =>
          request.headers.get('x-allow-introspection') !== 'secret-access-key',
      }))
    }

    const yoga = createYoga(yogaConfig)

    // Bind GraphQL Yoga to `/graphql` endpoint
    app.use(async (ctx, next) => {
      if (!ctx.request.originalUrl.includes('/graphql')) {
        return next()
      } else {
        ctx.disableBodyParser = true
      }

      ctx.state.logger.emit('resolving_graphql', 'debug', { params: ctx.params })

      // Second parameter adds Koa's context into GraphQL Context
      const response = await yoga.handleNodeRequest(ctx.req, ctx)

      // Set status code
      ctx.status = response.status

      // Set headers
      // TODO: This is copied from Yoga's example... it has a weird smell to it... debug it to see if the second arg is ok
      response.headers.forEach((/** @type {string | string[]} */ value, /** @type {string} */ key) => {
        ctx.append(key, value)
      })

      // Converts ReadableStream to a NodeJS Stream
      ctx.body = response.body
    })

    // the bodyParser has to come after Yoga and before the routes: it breaks the graphql queries
    app.use(bodyParser({
      onerror: (err, ctx) => {
        ctx.state.logger.emit('bodyparser_error', 'error', err)
        ctx.throw(422, 'unable to parse the body')
      },
    }))

    /**
     * register the routes that were defined in compose-domains.js
     */
    context.routes.forEach(
      (/** @type {IKoaRouteFactory} */ registerRoutes) => registerRoutes(router))

    app.use(router.routes())
    context.app = app
    context.router = router

    context.logger.emit('compose_app_complete', 'trace', 'compose_app_complete')
    return context
  } catch (/** @type {any} */ e) {
    throw new StartupError('compose_app_failed', e)
  }
} // /compose.app
