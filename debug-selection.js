// Quick debug script to identify selection issue
import { test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActivityPhase } from './src/phases/ActivityPhase'

const mockSessionState = {
  phase: 'activity',
  timeConfig: {
    mode: 'duration',
    duration: 60 * 60 * 1000
  },
  activities: [
    {
      id: 'activity-1',
      name: 'Email Processing',
      description: 'Handle inbox',
      estimatedDuration: 15 * 60 * 1000
    }
  ],
  sessionStartTime: new Date('2025-06-04T10:00:00.000Z')
}

test('debug selection', async () => {
  const user = userEvent.setup()
  const mockOnStateChange = vi.fn()
  const mockOnComplete = vi.fn()
  
  render(<ActivityPhase 
    sessionState={mockSessionState} 
    onStateChange={mockOnStateChange}
    onComplete={mockOnComplete}
  />)
  
  console.log('Before click:')
  console.log(screen.getByText(/selected:/i).textContent)
  
  const timelineActivity = screen.getByTestId('timeline-activity-1')
  await user.click(timelineActivity)
  
  console.log('After click:')
  console.log(screen.getByText(/selected:/i).textContent)
})
