import koaCors from '@koa/cors'
import type { appCtxSchema } from '../typedefs/ctx-app-lifecycle'

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

/**
 * Adds CORS middleware to the app
 */
export const cors = (appCtx: appCtxSchema) => koaCors({
  origin: appCtx.env.CLIENT_ORIGIN,
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowHeaders: [
    'Authorization', 'Accepts', 'Content-Type', 'If-Match',
    'If-Modified-Since', 'If-None-Match', 'If-Unmodified-Since', 'Range',
    'X-Requested-With', 'X-Request-ID'
  ],
  exposeHeaders: [
    'Content-Length', 'Date', 'ETag', 'Expires', 'Last-Modified',
    'X-Powered-By', 'X-Request-ID', 'X-heinz-95729-Media-Type'
  ],
  maxAge: 120,
  credentials: true,
})

export default cors
