import Koa from 'koa'
import httpMocks from 'node-mocks-http'
import { makeMockKoaContextState } from './make-mock-koa-context-state.js'
import { makeMockCookies } from './make-mock-cookies.js'

/**
 * If just the body or rawBody were supplied, make sure
 * the missing property exists
 * @param {IMockKoaContextOptions} options
 */
const ensureBodies = ({
  body,
  rawBody,
  parse = JSON.parse,
  stringify = JSON.stringify,
}) => {
  if (body && !rawBody) {
    return { body, rawBody: stringify(body) }
  } else if (typeof rawBody === 'string' && !body) {
    return { body: parse(rawBody), rawBody }
  } else {
    return { body, rawBody }
  }
}

/**
 * Generates a mock Koa ctx object
 * @param {IMockKoaContextOptions} [options]
 * @returns {Promise<{ app: Koa, ctx: IMockKoaContext }>}
 */
export const makeMockKoaContext = async (options) => {
  const koaApp = options?.app || new Koa()
  const req = httpMocks.createRequest(options?.req)
  const res = httpMocks.createResponse(options?.res)

  /**
   * Koa sets a default status code of 404, not the node
   * default of 200.
   * @see https://github.com/koajs/koa/blob/master/docs/api/response.md#responsestatus
   */
  res.statusCode = 404 // eslint-disable-line functional/immutable-data

  /**
   * This is to get around an odd behavior in the `cookies` library,
   * where if `res.set` is defined, it will use an internal node function
   * to set headers, which results in them being set in the wrong place.
   */
  // @ts-ignore
  res.set = undefined // eslint-disable-line functional/immutable-data

  const _context = koaApp.createContext(req, res)

  const context = {
    ..._context,
    ...koaApp.createContext(req, res),
    ...{
      ...options?.ctx,
      ...{
        cookies: makeMockCookies(req, res, options?.cookies),
        state: makeMockKoaContextState(options?.state),
      },
    },
  }

  const maybeBodies = ensureBodies(options || {})

  context.request.body = maybeBodies.body // eslint-disable-line functional/immutable-data
  context.request.rawBody = maybeBodies.rawBody // eslint-disable-line functional/immutable-data

  return { app: koaApp, ctx: context }
}

export default makeMockKoaContext

// TODO: add stream support if I we add stream processing to anything that gets tested
// import stream from 'node:stream'
// // Some functions we call in the implementations will perform checks for `req.encrypted`, which delegates to the socket.
// // MockRequest doesn't set a fake socket itself, so we create one here.
// req.socket = new stream.Duplex()
// Object.defineProperty(req.socket, 'encrypted', {
//   writable: false,
//   value: urlObject.protocol === 'https:',
// })
