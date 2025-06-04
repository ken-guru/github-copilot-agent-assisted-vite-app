import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActivityPhase } from './src/phases/ActivityPhase.jsx'

const mockSessionState = {
  id: 'test-session',
  phase: 'activity',
  timeConfig: {
    mode: 'duration',
    duration: 60 * 60 * 1000 // 1 hour in ms
  },
  activities: [
    {
      id: 'activity-1',
      name: 'Email Processing',
      description: 'Handle inbox and respond to emails',
      estimatedDuration: 15 * 60 * 1000 // 15 minutes
    }
  ],
  sessionStartTime: new Date('2025-06-04T10:00:00.000Z')
}

const mockOnStateChange = () => {}
const mockOnComplete = () => {}

// Simple test
async function test() {
  render(<ActivityPhase 
    sessionState={mockSessionState}
    onStateChange={mockOnStateChange}
    onComplete={mockOnComplete}
  />)
  
  console.log('Initial render complete')
  console.log('Timeline activity:', document.querySelector('[data-testid="timeline-activity-1"]'))
  
  const user = userEvent.setup()
  const emailActivity = screen.getByTestId('timeline-activity-1')
  console.log('Found timeline activity:', emailActivity)
  
  await user.click(emailActivity)
  console.log('Clicked timeline activity')
  
  console.log('Selected text:', document.querySelector('p')?.textContent)
}

test().catch(console.error)
