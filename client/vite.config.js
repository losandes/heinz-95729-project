import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

/**
 * @param {{ mode: string }} options - mode is NODE_ENV
 */
export default async ({ mode }) => {
  dotenv.config() // load env vars from .env

  return defineConfig({
    plugins: [vue()],
    envDir: process.cwd(),
    envPrefix: ['VITE_'],
    server: {
      host: process.env.VITE_SERVER_HOST,
      port: process.env.VITE_SERVER_PORT,
      proxy: {
        '/api': {
          target: process.env.VITE_API_ORIGIN,
          changeOrigin: Boolean(process.env.PROXY_CHANGE_ORIGIN),
          secure: Boolean(process.env.PROXY_SECURE),
          ws: Boolean(process.env.PROXY_SUPPORT_WEBSOCKETS),
        },
      },
    },
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}'],
    },
  })
}
