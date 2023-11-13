import Koa from 'koa'
import Router from 'koa-router'
import { getPalettes } from '~~domains/about'

const app = new Koa()
const router = new Router()

router.get('/api/palettes', getPalettes())

app.use(router.routes())

export default app
