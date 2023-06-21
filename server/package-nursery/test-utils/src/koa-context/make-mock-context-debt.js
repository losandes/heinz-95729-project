/* eslint-disable */
/**
 * @techdebt
 * This is probably tech debt to be removed. I wrote
 * MockKoaContext after writing this. I think that's the
 * one to go with. It has a dependency on an express
 * package that might prove to be more trouble than it's
 * worth. If that's the case, then keep working on this
 * instead.
 * -- 2023-03-23
 */
import Stream from 'stream'
import Koa from 'koa'
import { makeMockCookies } from './make-mock-cookies.js'
import { makeMockKoaContextState } from './make-mock-koa-context-state.js'

/**
 * Makes a simple base request object that is extensible
 * @param {any} extensions
 * @param {{
 *   parse: (body: string) => any,
 *   stringify: (body: any) => string
 * }} options
 * @returns {import('node:http').IncomingMessage}
 */
const makeReq = (extensions, { parse, stringify }) => {
  const socket = new Stream.Duplex()

  const req = {
    ...{ headers: {}, socket },
    ...Stream.Readable.prototype,
    ...(extensions || {}),
  }

  req.socket.remoteAddress = req.socket.remoteAddress || '0.0.0.0'

  /**
   * If just the body or rawBody were supplied, make sure
   * the missing property exists
   */
  if (req.body && !req.rawBody) {
    req.rawBody = stringify(req.body)
  } else if (typeof req.rawBody === 'string' && !req.body) {
    req.body = parse(req.rawBody)
  }

  return req
}

/**
 * Makes a simple base response object that is extensible
 * @param {any} extensions
 * @returns {import('node:http').ServerResponse<import('node:http').IncomingMessage>}
 */
const makeRes = (extensions) => {
  const socket = new Stream.Duplex()

  const res = {
    ...{ _headers: {}, socket },
    ...Stream.Writable.prototype,
    ...(extensions || {}),
  }

  /**
   * @param {string} key
   */
  res.getHeader = (key) => res._headers[key.toLowerCase()]

  /**
   * @param {string} key
   * @param {string} value
   */
  res.setHeader = (key, value) => (res._headers[key.toLowerCase()] = value)

  /**
   * @param {string} key
   * @param {string} value
   */
  res.append = (key, value) => (
    res._headers[key.toLowerCase()] =
    [res._headers[key.toLowerCase()], value].join(',')
    // TODO: not sure koa uses a comma deliter - this might be a bogus mock
  )

  /**
   * @param {string} key
   */
  res.removeHeader = (key) => delete res._headers[key.toLowerCase()]

  return res
}

/**
 * Creates a mock of koa context
 * @deprecated
 * @param {IMockKoaContextOptions} options
 * @returns {IKoaContext}
 * @see https://github.com/koajs/koa/issues/999 - koa issue on this subject
 * @see https://gist.github.com/emmanuelnk/f1254eed8f947a81e8d715476d9cc92c - the gist this is inspired by
 * @see https://github.com/koajs/koa/blob/master/test/helpers/context.js - the gist that gist was based on
 * @see https://www.npmjs.com/package/@shopify/jest-koa-mocks - a jest example of something like this
 */
export const makeMockKoaContext = ({
  app = undefined,
  cookies = undefined,
  state = undefined,
  req = {},
  res = {},
  ctx = {},
  parse = JSON.parse,
  stringify = JSON.stringify,
}) => {
  app = app || new Koa()
  const request = makeReq(req, { parse, stringify })
  const response = makeRes(res)
  const context = {
    ...app.createContext(request, response),
    ...{
      ...ctx,
      ...{
        cookies: makeMockCookies(request, response, cookies),
        state: makeMockKoaContextState(state),
      },
    },
  }

  return context
}

export default makeMockKoaContext
