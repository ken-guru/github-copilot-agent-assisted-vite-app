import type { Activity, SessionState, TimeConfig } from '../types'
import { vi } from 'vitest'

/**
 * Test utilities and factories for Mr. Timely components
 */

export const createMockTimeConfig = (overrides: Partial<TimeConfig> = {}): TimeConfig => ({
  mode: 'duration',
  duration: 1800000, // 30 minutes default
  ...overrides,
})

export const createMockActivity = (overrides: Partial<Activity> = {}): Activity => ({
  id: `activity-${Date.now()}-${Math.random()}`,
  name: 'Test Activity',
  description: 'Test activity description',
  estimatedDuration: 15 * 60 * 1000, // 15 minutes default
  status: 'pending',
  color: '#3B82F6',
  ...overrides,
})

export const createMockSessionState = (overrides: Partial<SessionState> = {}): SessionState => ({
  phase: 'setup',
  activities: [],
  selectedActivityId: undefined,
  ...overrides,
})

export const createMockActivityList = (count: number): Activity[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockActivity({
      id: `activity-${index}`,
      name: `Activity ${index + 1}`,
      color: `hsl(${(index * 137) % 360}, 70%, 50%)`, // Generate distinct colors
    })
  )
}

export const createActiveActivity = (overrides: Partial<Activity> = {}): Activity => ({
  ...createMockActivity(overrides),
  status: 'active',
  startTime: new Date(),
})

export const createCompletedActivity = (overrides: Partial<Activity> = {}): Activity => {
  const startTime = new Date(Date.now() - 300000) // 5 minutes ago
  const endTime = new Date()
  
  return {
    ...createMockActivity(overrides),
    status: 'completed',
    startTime,
    endTime,
  }
}

export const mockTimerFunctions = {
  setInterval: vi.fn(),
  clearInterval: vi.fn(),
  setTimeout: vi.fn(),
  clearTimeout: vi.fn(),
}

// Mock date for consistent testing
export const mockDate = (date: string | Date) => {
  const mockDateObj = new Date(date)
  vi.setSystemTime(mockDateObj)
  return mockDateObj
}

// Test helpers for theme testing
export const mockThemePreference = (theme: 'light' | 'dark' | 'system' = 'system') => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: theme === 'dark' && query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Test helpers for localStorage mocking
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
    },
  })
  
  return store
}
