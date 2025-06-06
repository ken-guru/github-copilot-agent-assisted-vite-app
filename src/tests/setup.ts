import '@testing-library/jest-dom'
import { beforeAll, afterAll } from 'vitest'

// Suppress React act warnings during tests
// These warnings are expected when testing components with timers
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      (typeof args[0] === 'string' && args[0].includes('An update to LoadingPhase inside a test was not wrapped in act')) ||
      (typeof args[0] === 'string' && args[0].includes('Warning: An update to'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
