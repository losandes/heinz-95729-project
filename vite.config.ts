import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import koaHost from './api/vite.koa-host'

const __dirname = dirname(fileURLToPath(import.meta.url))
const r = (path: string) => resolve(__dirname, path)
const apiAliases = {
  '@api-domains': r('api/src/domains'),
  '@api-lib': r('api/src/lib'),
}
const webAliases = {
  '@domains': r('src/domains'),
  '@layouts': r('src/layouts'),
  '@lib': r('src/lib'),
  '@pages': r('src/pages'),
  // direct file resolution (below) requires the module to also be defined in src/vite-env.d.ts
  '@env': r('src/lib/env/index.ts'),
  '@logger': r('src/lib/logger/index.ts'),
}

export const alias: Record<string, string> = {
  ...apiAliases,
  ...webAliases,
}

// https://vitejs.dev/config/
export default async ({ mode }) => defineConfig({
  build: { outDir: `./dist/${mode}` },
  envDir: process.cwd(),
  envPrefix: ['PUBLIC_'],
  plugins: [
    koaHost(),
    react(),
  ],
  resolve: { alias },
})
