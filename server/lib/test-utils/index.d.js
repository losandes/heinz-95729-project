/**
 * LOGGER ======================================================================
 */

/**
 * @typedef {Object} InspectableLogger
 * @property {() => any[]} logs
 */

/**
 * COOKIES =====================================================================
 */

/**
 * @typedef {import('koa').Context['cookies']} Cookies
 */

/**
 * @typedef {Object} IMockCookies
 * @property {IMap<string, string>} requestStore
 * @property {IMap<string, string>} responseStore
 */

/**
 * @typedef {Cookies & IMockCookies} MockCookies
 */

/**
 * KOA CONTEXT =================================================================
 */

/**
 * @typedef {Object} IMockKoaContextStateOptions
 * @property {number} [affinityTime]
 * @property {string} [affinityId]
 * @property {string} [method]
 * @property {string} [url]
 * @property {string} [origin]
 * @property {string} [maybeProxiedOrigin]
 * @property {import('@polyn/logger').ILogEmitter} [logger]
 * @property {Object.<string, IDataResolver>} [resolvers]
 * @property {ISession} [session]
 * @property {IENVVARS} [env]
 * @property {IStorageNamepaces} [storage]
 */

/**
 * @typedef {Object} IMockKoaContextMiddlewareExtensions
 * @property {any} [body] - koa-bodyparser
 * @property {string} [rawBody] - koa-bodyparser
 */

/**
 * @typedef {Object} IMockKoaContextExtensions
 * @property {MockCookies} cookies
 * @property {import('koa').Context['request'] & IMockKoaContextMiddlewareExtensions} request
 */

/**
 * @typedef {import('koa').Context & IMockKoaContextExtensions} IMockKoaContext
 */

/**
 * @typedef {Object} IMockKoaContextOptions
 * @property {import('koa')} [app]
 * @property {any} [cookies]
 * @property {IMockKoaContextStateOptions} [state]
 * @property {any} [body]
 * @property {string} [rawBody]
 * @property {import('node-mocks-http').RequestOptions} [req]
 * @property {import('node-mocks-http').ResponseOptions} [res]
 * @property {any} [ctx]
 * @property {(body: string) => any} [parse]
 * @property {(body: any) => string} [stringify]
 */
