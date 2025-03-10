import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/documentation/**',
        '**/node_modules/**',
        '**/src/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier,vue}.config.*'
      ],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './documentation/static/coverage'
    }
  },
})