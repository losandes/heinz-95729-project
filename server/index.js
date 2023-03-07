import { composeContext } from './src/compose-context.js'
import { composeApp } from './src/compose-graphql.js'
import { start } from './src/start.js'
import { verify } from './src/verify.js'
import { exit } from './src/exit.js'
import StartupError from './src/StartupError.js'
import {
  login,
  logout,
  authorize,
  deauthorize,
  requireSession, // eslint-disable-line no-unused-vars
  testSession,
} from '@heinz-95729/auth'
import { loaders as userLoaders, resolvers as userResolvers } from '@heinz-95729/users'

/**
 * Composes the dependency graph
 * @param {IAppContext} context the context produced by `compose-context`
 * @returns {Promise<IAppContext>}
 */
const composeDomains = async (context) => {
  try {
    /* Users
     * =========================================================================
     */
    await userLoaders.indexUsers(context)
    context.resolverFactories.push(userResolvers.resolveUsers)

    /* Auth
     * =========================================================================
     */
    context.routes.push((/** @type {IKoaRouter} */ router) => {
      /**
       * Usage with HTTPie:
       *   http POST http://localhost:3001/api/login <<< '{ "email": "shopper1@95729.com" }'
       *   http POST http://localhost:3001/api/logout
       *   http POST http://localhost:3001/api/session/test
       *
       * Usage with cURL (note you may need to escape the body differently on your operating system (see comments in the answer to https://stackoverflow.com/questions/7172784/how-do-i-post-json-data-with-curl)):
       *   curl --header "Content-Type: application/json" --request POST --data "{\"email\":\"shopper1@95729.com\" }" http://localhost:3001/api/login
       *   curl --request POST http://localhost:3001/api/logout
       *   curl --request POST http://localhost:3001/api/session/test
       */
      router.post('/login',
        login((ctx) => `${ctx.origin}${context.env.ROUTER_PREFIX}/authorize`))
      router.get('/authorize',
        authorize(`${context.env.WEB_APP_ORIGIN}/auth/authorized`))
      router.post('/logout',
        logout((ctx) => `${ctx.origin}${context.env.ROUTER_PREFIX}/deauthorize`))
      router.get('/deauthorize',
        deauthorize(`${context.env.WEB_APP_ORIGIN}/auth/login`))
      router.get('/session/test',
        testSession())
    })

    /* NEXT DOMAIN BELOW THIS
     * ========================================================================= */

    context.logger.emit('compose_domains_complete', 'trace', 'compose_domains_complete')

    // @ts-ignore
    return context
  } catch (/** @type {any} */ e) {
    throw new StartupError('compose_domains_failed', e)
  }
} // /compose.domains

// start the app
await composeContext()
  .then(composeDomains)
  .then(composeApp)
  .then(start)
  .then(verify)
  .catch(exit)
