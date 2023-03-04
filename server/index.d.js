/**
 * @template T
 * @typedef {Object.<string, T>} IMap
 */

/**
 * App Context
 * =============================================================================
 */

/**
 * @typedef {import('keyv').Store<any> & import('node:events').EventEmitter} IStorage
 */

/**
 * @typedef {Object} IStorageNamepaces
 * @property {IStorage} users
 * @property {IStorage} products
 */

/**
 * @typedef {{ name: string } & any} IDataResolver
 */

/**
 * @callback IDataResolverFactory
 * @param {IKoaContext} ctx
 * @returns {IDataResolver}
 */

/**
 * @typedef {Object} IPartialAppContext
 * @property {IENVVARS} [env]
 * @property {import('@polyn/logger').LogEmitter} [logger]
 * @property {IStorageNamepaces} [storage]
 * @property {IKoaRouteFactory[]} [routes]
 * @property {IDataResolverFactory[]} [resolverFactories]
 */

/**
 * @typedef {Object} IAppContext
 * @property {IENVVARS} env
 * @property {import('@polyn/logger').LogEmitter} logger
 * @property {IStorageNamepaces} storage
 * @property {IKoaRouteFactory[]} routes
 * @property {IDataResolverFactory[]} resolverFactories
 */

/**
 * KOA Customizations
 * =============================================================================
 */

/**
 * @typedef {Object} IKoaContextState
 * @property {string} affinityId
 * @property {string} method
 * @property {string} url
 * @property {string} origin
 * @property {import('@polyn/logger').ILogEmitter} logger
 * @property {IENVVARS} env
 * @property {IStorageNamepaces} storage
 * @property {Object.<string, IDataResolver>} resolvers
 * @property {ISession} [session]
 */

/**
 * @template {any} [TResponseBody=any]
 * @typedef {import('koa').ParameterizedContext<IKoaContextState, import('koa').DefaultContext, TResponseBody>} IKoaContext
 */

/**
 * @callback IKoaRoute
 * @param {IKoaContext} ctx
 * @returns {Promise<void>}
 */

/**
 * @callback IKoaRouteDefinition
 * @param {string | RegExp} path
 * @param {import('koa').Middleware<IKoaContextState>} middleware
 */

/**
 * @typedef {Object} IKoaRouter
 * @property {IKoaRouteDefinition} get
 * @property {IKoaRouteDefinition} patch
 * @property {IKoaRouteDefinition} post
 * @property {IKoaRouteDefinition} put
 * @property {IKoaRouteDefinition} delete
 */

/**
 * @callback IKoaRouteFactory
 * @param {IKoaRouter} router
 * @returns {void}
 */
