import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ActivityPhase } from '../phases/ActivityPhase'
import { createMockSessionState, createMockActivity, createMockTimeConfig } from './testUtils'
import type { SessionState } from '../types'

describe('ActivityPhase', () => {
  let mockSessionState: SessionState
  let mockOnStateChange: ReturnType<typeof vi.fn>
  let mockOnComplete: ReturnType<typeof vi.fn>

  // Helper functions for unambiguous element selection
  const getTimelineActivity = (activityTestId: string) =>
    screen.getByTestId(`timeline-${activityTestId}`)
  
  const getSwitchButton = (activityName: string) =>
    screen.getByRole('button', { name: `Switch to ${activityName}` })

  beforeEach(() => {
    vi.useRealTimers()
    
    mockSessionState = createMockSessionState({
      phase: 'activity',
      timeConfig: createMockTimeConfig({ duration: 1800000 }), // 30 minutes
      activities: [
        createMockActivity({ id: 'activity-1', name: 'First Activity', estimatedDuration: 900000 }), // 15 min
        createMockActivity({ id: 'activity-2', name: 'Second Activity', estimatedDuration: 900000 }) // 15 min
      ],
      activityProgress: [],
      sessionStartTime: new Date()
    })
    
    mockOnStateChange = vi.fn()
    mockOnComplete = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByTestId('activity-phase')).toBeInTheDocument()
    expect(screen.getByText('Active Session')).toBeInTheDocument()
  })

  it('displays session information correctly', () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByText('Time Remaining: 30:00')).toBeInTheDocument()
    expect(screen.getByText('Session Elapsed: 0:00')).toBeInTheDocument()
  })

  it('displays all activities in timeline', () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(getTimelineActivity('activity-1')).toBeInTheDocument()
    expect(getTimelineActivity('activity-2')).toBeInTheDocument()
    expect(screen.getByTestId('activity-timeline')).toBeInTheDocument()
  })

  it('displays progress bar with correct initial value', () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    expect(progressBar).toHaveTextContent('0%')
  })

  it('selects activity when timeline activity is clicked', async () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const timelineActivity = getTimelineActivity('activity-1')
    fireEvent.click(timelineActivity)

    await waitFor(() => {
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedActivityId: 'activity-1'
        })
      )
    })
  })

  it('switches activity using switch button', async () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const switchButton = getSwitchButton('First Activity')
    fireEvent.click(switchButton)

    await waitFor(() => {
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedActivityId: 'activity-1'
        })
      )
    })
  })

  it('displays current activity selection', () => {
    const sessionWithSelection = {
      ...mockSessionState,
      selectedActivityId: 'activity-1'
    }

    render(
      <ActivityPhase
        sessionState={sessionWithSelection}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByText('Selected: First Activity')).toBeInTheDocument()
  })

  it('shows start button when activity is selected but not active', () => {
    const sessionWithSelection = {
      ...mockSessionState,
      selectedActivityId: 'activity-1'
    }

    render(
      <ActivityPhase
        sessionState={sessionWithSelection}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByRole('button', { name: 'Start Activity' })).toBeInTheDocument()
  })

  it('starts activity when start button is clicked', async () => {
    const sessionWithSelection = {
      ...mockSessionState,
      selectedActivityId: 'activity-1'
    }

    render(
      <ActivityPhase
        sessionState={sessionWithSelection}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const startButton = screen.getByRole('button', { name: 'Start Activity' })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeActivityId: 'activity-1'
        })
      )
    })
  })

  it('shows pause button when activity is active', () => {
    const sessionWithActiveActivity = {
      ...mockSessionState,
      selectedActivityId: 'activity-1',
      activeActivityId: 'activity-1',
      activityProgress: [{
        activityId: 'activity-1',
        completed: false,
        timeSpent: 0,
        startTime: new Date()
      }]
    }

    render(
      <ActivityPhase
        sessionState={sessionWithActiveActivity}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByRole('button', { name: 'Pause Activity' })).toBeInTheDocument()
  })

  it('pauses activity when pause button is clicked', async () => {
    const sessionWithActiveActivity = {
      ...mockSessionState,
      selectedActivityId: 'activity-1',
      activeActivityId: 'activity-1',
      activityProgress: [{
        activityId: 'activity-1',
        completed: false,
        timeSpent: 5000,
        startTime: new Date(Date.now() - 5000)
      }]
    }

    render(
      <ActivityPhase
        sessionState={sessionWithActiveActivity}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const pauseButton = screen.getByRole('button', { name: 'Pause Activity' })
    fireEvent.click(pauseButton)

    await waitFor(() => {
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeActivityId: null
        })
      )
    })
  })

  it('updates elapsed time for active activity', async () => {
    vi.useRealTimers()
    
    const sessionWithActiveActivity = {
      ...mockSessionState,
      selectedActivityId: 'activity-1',
      activeActivityId: 'activity-1',
      activityProgress: [{
        activityId: 'activity-1',
        completed: false,
        timeSpent: 0,
        startTime: new Date(Date.now() - 1000)
      }]
    }

    render(
      <ActivityPhase
        sessionState={sessionWithActiveActivity}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    // Wait for timer update
    await waitFor(() => {
      expect(mockOnStateChange).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('calculates session progress correctly', () => {
    const sessionWithProgress = {
      ...mockSessionState,
      activityProgress: [
        { activityId: 'activity-1', completed: false, timeSpent: 600000, startTime: new Date() }, // 10 minutes
        { activityId: 'activity-2', completed: false, timeSpent: 300000, startTime: new Date() }  // 5 minutes
      ]
    }

    render(
      <ActivityPhase
        sessionState={sessionWithProgress}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '50') // 15 min of 30 min total
    expect(progressBar).toHaveTextContent('50%')
  })

  it('completes session when all activities are done', async () => {
    const completedSession = {
      ...mockSessionState,
      activityProgress: mockSessionState.activities.map(activity => ({
        activityId: activity.id,
        completed: true,
        timeSpent: activity.estimatedDuration || 0,
        startTime: new Date(),
        endTime: new Date()
      }))
    }

    render(
      <ActivityPhase
        sessionState={completedSession}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })

  it('supports keyboard navigation for timeline activities', () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const timelineActivity = getTimelineActivity('activity-1')
    expect(timelineActivity).toHaveAttribute('tabindex', '0')
    expect(timelineActivity).toHaveAttribute('role', 'button')
  })

  it('handles keyboard interaction for timeline activities', async () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const timelineActivity = getTimelineActivity('activity-1')
    fireEvent.keyDown(timelineActivity, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedActivityId: 'activity-1'
        })
      )
    })
  })

  it('provides screen reader announcements', () => {
    render(
      <ActivityPhase
        sessionState={mockSessionState}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Activity Timeline')).toBeInTheDocument()
    expect(screen.getByLabelText('Session Progress')).toBeInTheDocument()
  })

  it('updates progress bar color based on completion percentage', () => {
    const sessionWithHighProgress = {
      ...mockSessionState,
      activityProgress: [
        { activityId: 'activity-1', completed: false, timeSpent: 1080000, startTime: new Date() }, // 18 minutes
        { activityId: 'activity-2', completed: false, timeSpent: 540000, startTime: new Date() }   // 9 minutes
      ]
    }

    render(
      <ActivityPhase
        sessionState={sessionWithHighProgress}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('progress-red') // > 80% completion
  })

  it('displays remaining time correctly', () => {
    const sessionWithProgress = {
      ...mockSessionState,
      activityProgress: [
        { activityId: 'activity-1', completed: false, timeSpent: 300000, startTime: new Date() }, // 5 minutes
        { activityId: 'activity-2', completed: false, timeSpent: 0, startTime: new Date() }
      ]
    }

    render(
      <ActivityPhase
        sessionState={sessionWithProgress}
        onStateChange={mockOnStateChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByText('Time Remaining: 25:00')).toBeInTheDocument()
    expect(screen.getByText('Session Elapsed: 5:00')).toBeInTheDocument()
  })
})
