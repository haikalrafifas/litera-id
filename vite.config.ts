import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' for React components
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'text-summary'],
      // include: ['src/**/*.{ts,tsx}'],
    },
  },
})
