import { createYoga, createSchema } from 'graphql-yoga'
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection'
import { verifySession } from '@heinz-95729/auth'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import Router from 'koa-router'
import cors from '@koa/cors'
import * as koaErrorsPkg from '@robotsandpencils/koa-errors'

import loadTypeDefs from '../schema/index.js'

import { addReportingEndpointHeaders } from './middleware/add-reporting-endpoint-headers.js'
import captureCSPViolations from './middleware/capture-csp-violations.js'
import gatherRequestMetrics from './middleware/gather-request-metrics.js'
import setCsp from './middleware/set-csp-header.js'
import rateLimiter from './middleware/limit-request-rates.js'
import makeRequestState from './middleware/make-request-ctx-state.js'

import StartupError from './StartupError.js'

const { e500 } = koaErrorsPkg
const SECURITY_VIOLATION_REPORT_NAME = 'security-violation-endpoint' // for Report-To header
const SECURITY_VIOLATION_REPORT_PATH = '/security-violation-report'  // the route path

/**
 * Creates an instance of Koa, and the default router
 * @param {IAppContext} context the context produced by `bootstrap`
 * @returns {Promise<IAppContext>}
 */
export const composeApp = async (context) => {
  try {
    /** @type {Koa<IKoaContextState, Koa.DefaultContext>} */
    const app = new Koa()
    app.proxy = context.env.SERVER_IS_IN_PROXY

    /** @type {IKoaRouter} */
    // @ts-ignore
    const router = app.proxy
      ? new Router({ prefix: context.env.SERVER_PROXY_PREFIX })
      : new Router()

    app.on('error', (err, ctx) => {
      /**
       * prefer the ctx.state.logger because it has an affinity id
       * to help us read the logs in context of the other logs for
       * the same request, but fallback to the app's context.logger
       * to make sure we have the logs
       */
      const logger = ctx.state && ctx.state.logger && typeof ctx.state.logger.emit === 'function'
        ? ctx.state.logger
        : context.logger

      logger.emit('uncaught_koa_error', 'error', { err })
    })

    /**
     * Sends a JSON formatted error message to the client when an
     * unhandled exception occurs. Includes the error stack based
     * on the configuration you provide.
     */
    app.use(e500({
      showStack: !context.env.NODE_ENV_ENFORCE_SECURITY,
    }))

    /**
     * Request context
     * Sets the request `ctx.state` with both app and request lifecycle
     * environment information and tooling, such as a log emitter and
     * data resolvers.
     *
     * Note that because this establishes the request state, it needs to
     * run before any middleware that depends on that state being established
     */
    app.use(makeRequestState(context))

    /**
     * Wraps the request with metrics gathering
     * IMPORTANT! this depends on the `ctx.state` already being established
     * IMPORTANT! this should run early in the middleware stack to capture
     * the duration/latency of each request
     * @see https://github.com/losandes/polyn-logger#tracking-performance-and-metrics
     */
    app.use(gatherRequestMetrics())

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
     */
    app.use(rateLimiter())

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
      origin: context.env.CLIENT_ORIGIN,
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
      allowHeaders: ['Authorization', 'Accepts', 'Content-Type', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Unmodified-Since', 'Range', 'X-Requested-With', 'X-Request-ID'],
      exposeHeaders: ['Content-Length', 'Date', 'ETag', 'Expires', 'Last-Modified', 'X-Powered-By', 'X-Request-ID', 'X-heinz-95729-Media-Type'],
      maxAge: 120,
      credentials: true,
    }))

    /**
     * Use helmet to set several security headers.
     *
     * NOTE this uses koa-helmet, which is a wrapper of the helmet library.
     * @see https://helmetjs.github.io/
     * @see https://github.com/venables/koa-helmet
     */
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

    /**
     * Add reporting endpoints for security violations, such as
     * Content-Security-Policy violations.
     */
    app.use(addReportingEndpointHeaders({
      SECURITY_VIOLATION_REPORT_NAME,
      SECURITY_VIOLATION_REPORT_PATH,
    }))

    /**
     * Add a Content-Security-Policy header to the request
     */
    app.use(setCsp({
      prefix: router.opts.prefix,
      SECURITY_VIOLATION_REPORT_NAME,
      SECURITY_VIOLATION_REPORT_PATH,
    }))

    /**
     * Add the user's cookie/session to the `ctx.state` if it exists
     */
    app.use(verifySession())

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

    if (context.env.NODE_ENV_ENFORCE_SECURITY) {
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

    router.post(SECURITY_VIOLATION_REPORT_PATH, captureCSPViolations)

    /**
     * register the routes that were defined in compose-domains.js
     */
    context.routes.forEach(
      (/** @type {IKoaRouteFactory} */ registerRoutes) => registerRoutes(router))

    app.use(router.routes())
    context.app = app

    context.logger.emit('compose_app_complete', 'trace', 'compose_app_complete')
    return context
  } catch (/** @type {any} */ e) {
    throw new StartupError('compose_app_failed', e)
  }
} // /compose.app
