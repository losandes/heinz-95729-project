/**
 * # IMap<TKey, TVal>
 * Defines an object that is key-value-pairs of a
 * consistent type
 * @template TKey
 * @template TVal
 * @typedef {Object.<TKey, TVal>} IMap
 */

/**
 * @typedef {Object} IGroupedPromiseSettledResults
 * @property {PromiseFulfilledResult<any>[]} fulfilled
 * @property {PromiseRejectedResult[]} rejected
 */

/**
 * @typedef {Object} ISeedResult
 * @property {boolean} seeded
 * @property {number} fulfilled
 * @property {number} rejected
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
 * # IAppContext
 * This is the schema for the app lifecycle (generated per app
 * startup / runtime) variables and tools. Several of these properties
 * end up in or produce variables/tools that are added to the
 * request context (`ctx.state`; see IKoaContextState).
 *
 * - `env`: an object representing environment variables
 * - `logger`: an EventEmitter for logs (instance of @polyn/logger)
 * - `storage`: an object containing data storage repositories
 * - `routes`: an array of factories (functions) that add Koa Middleware to the router that is provided to each factory
 * - `resolverFactories`: an array of factories (functions) that add data resolvers to the request state
 * @typedef {Object} IAppContext
 * @property {IENVVARS} env
 * @property {import('@polyn/logger').LogEmitter} logger
 * @property {IStorageNamepaces} storage
 * @property {IKoaRouteFactory[]} routes
 * @property {IDataResolverFactory[]} resolverFactories
 * @property {IKoaApp} [app]
 */

/**
 * KOA Customizations
 * =============================================================================
 */

/**
 * # IKoaContextState
 * This is the schema for the `ctx.state` object, which is available
 * on every koa request.
 *
 * ### Request Lifecyle properties (generated per request):
 * - `affinityTime`: a number representing the time that the request was received by the server
 * - `affinityId`: a nonce string representing the ID of the request
 * - `method`: a string representing the HTTP method used for the request (e.g. GET, POST, etc.)
 * - `url`: a string representing the URL of the request
 * - `origin`: a string representing the HTTP origin of the request
 * - `maybeProxiedOrigin`: a string representing the HTTP origin of the request, with an additional path appended if the API is running in a proxy
 * - `logger`: an EventEmitter for logs (instance of @polyn/logger)
 * - `resolvers`: an object containing data resolvers
 * - `session`: an optional object representing session data
 *
 * ### App Lifecycle propertes (generated per app startup / runtime):
 * - `env`: an object representing environment variables
 * - `storage`: an object containing data storage repositories
 *
 * @typedef {Object} IKoaContextState
 * @property {number} affinityTime
 * @property {string} affinityId
 * @property {string} method
 * @property {string} url
 * @property {string} origin
 * @property {string} maybeProxiedOrigin
 * @property {import('@polyn/logger').ILogEmitter} logger
 * @property {Object.<string, IDataResolver>} resolvers
 * @property {ISession} [session]
 * @property {IENVVARS} env
 * @property {IStorageNamepaces} storage
 */

/**
 * This provides shorthand typedef access to Koa's ParameterizedContext
 * I use this all over the place. It doesn't just reduce the import
 * statements. It also sets the type of ctx.state to IKoaContextState.
 * @template {any} [TResponseBody=any]
 * @typedef {import('koa').ParameterizedContext<IKoaContextState, import('koa').DefaultContext, TResponseBody>} IKoaContext
 */

/**
 * # IKoaMiddleware
 * This provides shorthand typedef access to a typed Koa Middleware
 * using IKoaContextState as the type
 * @typedef {import('koa').Middleware<IKoaContextState>} IKoaMiddleware
 */

/**
 * @callback IKoaRouteDefinition
 * @param {string | RegExp} path
 * @param {IKoaMiddleware} middleware
 */

/**
 * There is something wrong with @types/koa-router. For some reason
 * I can't reference the Router class, which is where pretty much
 * everything is defined. This is a subset of the typedef for it.
 * I'm just adding things as I need them
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/koa-router/index.d.ts
 * @typedef {Object} IKoaRouter
 * @property {IKoaRouteDefinition} delete
 * @property {IKoaRouteDefinition} get
 * @property {IKoaRouteDefinition} head
 * @property {IKoaRouteDefinition} options
 * @property {IKoaRouteDefinition} patch
 * @property {IKoaRouteDefinition} post
 * @property {IKoaRouteDefinition} put
 * @property {string[]} methods - ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE']
 * @property {boolean} exclusive
 * @property {Object} params
 * @property {any[]} stack - guessing this is actually string[]... not sure yet
 * @property {any} host - guessing this is actually string... not sure yet
 * @property {import('koa-router').IRouterOptions} opts
 * @property {() => import('koa-router').IMiddleware<any, {}>} routes
 */

/**
 * @callback IKoaRouteFactory
 * @param {IKoaRouter} router
 * @returns {void}
 */

/**
 * # IKoaApp
 * This provides shorthand typedef access to a typed instance of Koa
 * using IKoaContextState as the type
 * @typedef {import('koa')<IKoaContextState, import('koa').DefaultContext>} IKoaApp
 */
