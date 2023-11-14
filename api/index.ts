import Koa from 'koa'
import Router from 'koa-router'
import { getPalettes } from './src/domains/about'
import {
  authorize,
  deauthorize,
  login,
  logout,
  testSession,
  verifySession,
} from './src/domains/auth'
import {
  bodyParser,
  composeAppCtx,
  cors,
  handleErrors,
  initDb,
  onError,
  reqContext,
} from './src/server'

const appCtx = await composeAppCtx()
await initDb(appCtx)
const app = new Koa({
  proxy: appCtx.env.SERVER_IS_IN_PROXY,
})
const router = app.proxy
  ? new Router({ prefix: appCtx.env.SERVER_PROXY_PREFIX })
  : new Router()

/**
 * ADD ROUTES BELOW
 * NOTE: the app is running in a proxy, so the `/api` prefix is already set
 * =============================================================================
 */
router.get('/palettes', getPalettes())

/**
 * Usage with HTTPie:
 *   http POST http://localhost:5173/api/login <<< '{ "email": "shopper1@95729.com" }'
 *   http POST http://localhost:5173/api/logout
 *   http POST http://localhost:5173/api/session/test
 *
 * Usage with cURL (note you may need to escape the body differently on your operating system (see comments in the answer to https://stackoverflow.com/questions/7172784/how-do-i-post-json-data-with-curl)):
 *   curl --header "Content-Type: application/json" --request POST --data "{\"email\":\"shopper1@95729.com\" }" http://localhost:5173/api/login
 *   curl --request POST http://localhost:5173/api/logout
 *   curl --request POST http://localhost:5173/api/session/test
 */
router.post('/login',
  login((ctx) => `${ctx.state.maybeProxiedOrigin}/authorize`))
router.get('/authorize',
  authorize(`${appCtx.env.CLIENT_ORIGIN}/auth/authorized`))
router.post('/logout',
  logout((ctx) => `${ctx.state.maybeProxiedOrigin}/deauthorize`))
router.get('/deauthorize',
  deauthorize(`${appCtx.env.CLIENT_ORIGIN}/auth/login`))
router.get('/session/test',
  testSession())

/**
 * ADD MIDDLEWARE BELOW (order matters!)
 * =============================================================================
 */
app.on('error', onError)
app.use(handleErrors(appCtx))
app.use(reqContext(appCtx))
app.use((ctx, next) => {
  appCtx.logger.emit('request', 'off', ctx.state); return next() })
app.use(cors(appCtx))
app.use(verifySession())
app.use(bodyParser())
app.use(router.routes())

export default app
