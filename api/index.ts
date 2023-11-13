import Koa from 'koa'
import Router from 'koa-router'
import { loadPalettes } from './src/domains/about'

const app = new Koa()
const router = new Router()

router.get('/api/hello', (ctx) => {
  ctx.body = { hello: 'world' }
})

router.get('/api/palettes', async (ctx) => {
  const palettes = await loadPalettes()
  ctx.body = palettes
})

app.use(router.routes())

export default app
