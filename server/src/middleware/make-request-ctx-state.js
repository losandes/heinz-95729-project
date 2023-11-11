import { init as makeCuidGenerator } from '@paralleldrive/cuid2'
const makeAffinityToken = makeCuidGenerator({ length: 12 })

/**
 * @param {IKoaContext} ctx
 * @returns {(resolverFactory: IDataResolverFactory) => void}
 */
const addResolverToState = (ctx) => (resolverFactory) => {
  const resolver = resolverFactory(ctx)

  ctx.state.resolvers[resolver.name] = resolver
}

/**
 * Request context
 * Sets the request `ctx.state` with both app and request lifecycle
 * environment information and tooling, such as a log emitter and
 * data resolvers.
 *
 * Note that because this establishes the request state, it needs to
 * run before any middleware that depends on that state being established
 * @param {IAppContext} context
 * @returns {import('koa').Middleware<IKoaContextState>}
 */
export const makeCtxState = (context) => async (ctx, next) => {
  const reqContext = {
    affinityTime: Date.now(),
    affinityId: makeAffinityToken(),
    method: ctx.request.method,
    url: ctx.request.url.split('?')[0],
    origin: ctx.get('Origin'), // i.e. http://localhost:3001
  }

  /** @type {IKoaContextState} */
  const state = {
    // request lifecycle
    affinityTime: reqContext.affinityTime,
    affinityId: reqContext.affinityId,
    method: reqContext.method,
    url: reqContext.url,
    origin: reqContext.origin,
    maybeProxiedOrigin: context.env.SERVER_PROXY_PREFIX?.length
      ? `${reqContext.origin}${context.env.SERVER_PROXY_PREFIX}`
      : reqContext.origin,
    // @ts-ignore - I think this is a bug in the polyn/logger types (types, not code)
    logger: context.logger.child({ context: reqContext }),
    resolvers: {},
    // app lifecycle
    env: context.env,
    storage: context.storage,
  }

  ctx.state = { ...ctx.state, ...state }

  // must run after ctx.state is established because resolvers
  // likely depend on the state (e.g. logger, storage, etc.)
  context.resolverFactories.forEach(addResolverToState(ctx))

  ctx.state.logger.emit('api_req_received', 'trace', reqContext)
  await next()
}

export default makeCtxState
