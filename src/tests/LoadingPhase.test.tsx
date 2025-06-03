import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LoadingPhase } from '../phases/LoadingPhase'

describe('LoadingPhase', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      vi.runAllTimers()
    })
    vi.useRealTimers()
  })

  it('displays loading indicator for minimum duration', async () => {
    const mockOnComplete = vi.fn()
    
    await act(async () => {
      render(<LoadingPhase onComplete={mockOnComplete} />)
    })
    
    // Should show loading indicator immediately
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Should not call onComplete immediately
    expect(mockOnComplete).not.toHaveBeenCalled()
  })

  it('transitions to setup phase after loading', async () => {
    const mockOnComplete = vi.fn()
    const minimumLoadTime = 1000 // 1 second
    
    await act(async () => {
      render(<LoadingPhase onComplete={mockOnComplete} minimumLoadTime={minimumLoadTime} />)
    })
    
    // Fast-forward time by minimum load time
    await act(async () => {
      vi.advanceTimersByTime(minimumLoadTime)
    })
    
    // Should call onComplete after minimum time
    expect(mockOnComplete).toHaveBeenCalledTimes(1)
  })

  it('applies correct theme during loading', async () => {
    const mockOnComplete = vi.fn()
    
    await act(async () => {
      render(<LoadingPhase onComplete={mockOnComplete} theme="dark" />)
    })
    
    const loadingContainer = screen.getByRole('status').closest('[data-theme]')
    expect(loadingContainer).toHaveAttribute('data-theme', 'dark')
  })

  it('handles theme detection and persistence', async () => {
    const mockOnComplete = vi.fn()
    const mockOnThemeDetected = vi.fn()
    
    // Mock system preference for dark theme
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    await act(async () => {
      render(
        <LoadingPhase 
          onComplete={mockOnComplete} 
          onThemeDetected={mockOnThemeDetected}
        />
      )
    })
    
    // Should detect system theme preference
    expect(mockOnThemeDetected).toHaveBeenCalledWith('dark')
  })

  it('displays application title and branding', async () => {
    const mockOnComplete = vi.fn()
    
    await act(async () => {
      render(<LoadingPhase onComplete={mockOnComplete} />)
    })
    
    expect(screen.getByText('Mr. Timely')).toBeInTheDocument()
    expect(screen.getByText(/time management/i)).toBeInTheDocument()
  })

  it('shows loading progress indicator', async () => {
    const mockOnComplete = vi.fn()
    
    await act(async () => {
      render(<LoadingPhase onComplete={mockOnComplete} />)
    })
    
    // Should have a visual progress indicator
    const progressElement = screen.getByRole('progressbar')
    expect(progressElement).toBeInTheDocument()
    expect(progressElement).toHaveAttribute('aria-label', 'Loading application')
  })

  it('handles keyboard accessibility during loading', async () => {
    const mockOnComplete = vi.fn()
    
    await act(async () => {
      render(<LoadingPhase onComplete={mockOnComplete} />)
    })
    
    const statusElement = screen.getByRole('status')
    expect(statusElement).toHaveAttribute('aria-live', 'polite')
    expect(statusElement).toHaveAttribute('aria-label', 'Application is loading')
  })

  it('respects custom minimum load time', async () => {
    const mockOnComplete = vi.fn()
    const customLoadTime = 2000
    
    await act(async () => {
      render(<LoadingPhase onComplete={mockOnComplete} minimumLoadTime={customLoadTime} />)
    })
    
    // Should not complete before custom time
    await act(async () => {
      vi.advanceTimersByTime(customLoadTime - 1)
    })
    expect(mockOnComplete).not.toHaveBeenCalled()
    
    // Should complete after custom time
    await act(async () => {
      vi.advanceTimersByTime(1)
    })
    expect(mockOnComplete).toHaveBeenCalledTimes(1)
  })
})
