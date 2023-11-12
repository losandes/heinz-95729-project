import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig, { alias } from './vite.config'

export default defineConfig((ctx) => mergeConfig(
  viteConfig(ctx),
  defineConfig({
    root: process.cwd(),
    test: {
      coverage: {
        provider: 'istanbul', // 'instanbul' | 'v8' (default) // istanbul is more accurate
        reporter: ['text', 'lcov'], // ['text', 'lcov', 'json', 'html'],
      },
      include: [
        '**/api/**/*.{test,spec}.?(c|m)[jt]s?(x)',
        '**/src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      ],
      exclude: [
        '**/dist',
        '**/node_modules/**',
        '**/temp/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      ],
    },
    resolve: {
      alias
    },
  }),
))
