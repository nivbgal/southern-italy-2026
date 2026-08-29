import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    reporters: process.env.CI ? ['default', 'github-actions'] : ['default'],
    coverage: { enabled: false },
  },
})
