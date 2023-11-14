import { type Context } from 'koa'
import loadPalettes from '../io/load-palettes'

export const getPalettes = () => async (ctx: Context) => {
  const palettes = await loadPalettes()
  ctx.body = palettes
}

export default getPalettes
