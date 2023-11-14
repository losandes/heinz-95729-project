import type { ResolvedConfig, ViteDevServer } from 'vite'
import app from '.'

const name = 'vite-koa-host'

/**
 * Called after the Vite config is resolved. Use this hook to read
 * and store the final resolved config. It is also useful when the
 * plugin needs to do something different based on the command being run.
 * @see https://vitejs.dev/guide/api-plugin.html#configresolved
 */
const configResolved = async (_config: ResolvedConfig) => {
  // console.log('configResolved::ResolvedConfig', { config })
}

/**
 * Hook for configuring the dev server. The most common use case
 * is adding custom middlewares to the internal connect app
 * @see https://vitejs.dev/guide/api-plugin.html#configureserver
 * @see https://github.com/senchalabs/connect
 */
const configureServer = (
  server: ViteDevServer
): (() => void) | void | Promise<(() => void) | void> => {
  // console.log('configureServer::ViteDevServer', { server })
  server.middlewares.use(async (req, res, next) => {
    if (req.url?.startsWith('/api')) {
      await app.callback()(req, res)
    } else {
      return next()
    }
  })
}

export default function ViteKoaHost () {
  // vite hooks:   https://vitejs.dev/guide/api-plugin.html
  // rollup hooks: https://rollupjs.org/plugin-development/
  return {
    name,
    configResolved,
    configureServer,
  }
}
