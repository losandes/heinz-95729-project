import Koa from 'koa'
import Router from 'koa-router'
import { getPalettes } from './src/domains/about'
import { verifySession } from './src/domains/auth'
import {
  bodyParser,
  onError,
  reqContext,
  composeAppCtx,
  cors,
  handleErrors,
} from './src/server'

const appCtx = await composeAppCtx()
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
 * ADD MIDDLEWARE BELOW (order matters!)
 * =============================================================================
 */
app.on('error', onError)
app.use(handleErrors(appCtx))
app.use(reqContext(appCtx))
app.use(cors(appCtx))
app.use(verifySession())
app.use(bodyParser())
app.use(router.routes())

export default app
