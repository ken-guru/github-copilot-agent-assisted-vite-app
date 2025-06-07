import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompletionPhase } from '../phases/CompletionPhase'
import type { SessionState } from '../types'

const mockSessionState: SessionState = {
  phase: 'completed',
  activities: [
    {
      id: '1',
      name: 'Planning',
      status: 'completed',
      color: '#3b82f6',
      estimatedDuration: 15 * 60 * 1000, // 15 minutes
      startTime: new Date('2025-06-07T10:00:00Z'),
      endTime: new Date('2025-06-07T10:12:00Z')
    },
    {
      id: '2', 
      name: 'Development',
      status: 'completed',
      color: '#10b981',
      estimatedDuration: 45 * 60 * 1000, // 45 minutes
      startTime: new Date('2025-06-07T10:15:00Z'),
      endTime: new Date('2025-06-07T11:05:00Z')
    }
  ],
  activityProgress: [
    {
      activityId: '1',
      completed: true,
      timeSpent: 12 * 60 * 1000, // 12 minutes actual
      startTime: new Date('2025-06-07T10:00:00Z'),
      endTime: new Date('2025-06-07T10:12:00Z')
    },
    {
      activityId: '2',
      completed: true,
      timeSpent: 50 * 60 * 1000, // 50 minutes actual
      startTime: new Date('2025-06-07T10:15:00Z'),
      endTime: new Date('2025-06-07T11:05:00Z')
    }
  ],
  timeConfig: {
    mode: 'duration',
    duration: 60 * 60 * 1000 // 60 minutes total
  },
  sessionStartTime: new Date('2025-06-07T10:00:00Z')
}

const mockOnRestart = vi.fn()

describe('CompletionPhase', () => {
  it('renders completion phase with basic elements', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    expect(screen.getByText('Session Complete!')).toBeInTheDocument()
    expect(screen.getByText('Summary')).toBeInTheDocument()
  })

  it('displays total time statistics', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    // Should show planned vs actual time
    expect(screen.getByText(/Planned Time/)).toBeInTheDocument()
    expect(screen.getByText(/Actual Time/)).toBeInTheDocument()
  })

  it('shows individual activity breakdown', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    expect(screen.getByText('Planning')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
  })

  it('displays time differences for each activity', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    // Planning: planned 15min, actual 12min = 3min under
    expect(screen.getByText(/3 min under/)).toBeInTheDocument()
    
    // Development: planned 45min, actual 50min = 5min over
    expect(screen.getByText(/5 min over/)).toBeInTheDocument()
  })

  it('shows completion status indicator', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    // Should determine if session was early, on-time, or overtime
    // Total planned: 60min, total actual: 62min = overtime
    expect(screen.getByText(/Session Status/)).toBeInTheDocument()
  })

  it('provides restart functionality', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    const restartButton = screen.getByRole('button', { name: /new session/i })
    expect(restartButton).toBeInTheDocument()
  })

  it('handles session with no activity progress', () => {
    const stateWithoutProgress: SessionState = {
      ...mockSessionState,
      activityProgress: []
    }

    render(
      <CompletionPhase 
        sessionState={stateWithoutProgress}
        onRestart={mockOnRestart}
      />
    )

    expect(screen.getByText('Session Complete!')).toBeInTheDocument()
    expect(screen.getByText(/No activities completed/)).toBeInTheDocument()
  })

  it('displays formatted time durations', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    // Should show times in readable format (e.g., "12 min", "1h 2 min")
    expect(screen.getByText(/12 min/)).toBeInTheDocument()
    expect(screen.getByText(/50 min/)).toBeInTheDocument()
  })

  it('provides accessibility features', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    // Main heading should be accessible
    const heading = screen.getByRole('heading', { name: /session complete/i })
    expect(heading).toBeInTheDocument()

    // Summary should be properly structured
    expect(screen.getByText('Summary')).toBeInTheDocument()
  })

  it('shows efficiency metrics', () => {
    render(
      <CompletionPhase 
        sessionState={mockSessionState}
        onRestart={mockOnRestart}
      />
    )

    // Should calculate efficiency percentage
    expect(screen.getByText(/Efficiency/)).toBeInTheDocument()
  })
})
