import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SetupPhase } from '../phases/SetupPhase'
import { createMockSessionState, createMockActivity } from './testUtils'

describe('SetupPhase', () => {
  const mockOnComplete = vi.fn()
  const mockOnStateChange = vi.fn()
  
  const defaultProps = {
    sessionState: createMockSessionState({ phase: 'setup' }),
    onComplete: mockOnComplete,
    onStateChange: mockOnStateChange
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('displays setup phase title and instructions', () => {
      render(<SetupPhase {...defaultProps} />)
      
      expect(screen.getByRole('heading', { name: /session setup/i })).toBeInTheDocument()
      expect(screen.getByText(/configure your time management session/i)).toBeInTheDocument()
    })

    it('shows time configuration section', () => {
      render(<SetupPhase {...defaultProps} />)
      
      expect(screen.getByText(/time configuration/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/duration mode/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/deadline mode/i)).toBeInTheDocument()
    })

    it('shows activities management section', () => {
      render(<SetupPhase {...defaultProps} />)
      
      expect(screen.getByText(/activities/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add activity/i })).toBeInTheDocument()
    })

    it('shows start session button', () => {
      render(<SetupPhase {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /start session/i })).toBeInTheDocument()
    })
  })

  describe('Time Configuration', () => {
    it('defaults to duration mode', () => {
      render(<SetupPhase {...defaultProps} />)
      
      const durationRadio = screen.getByLabelText(/duration mode/i)
      expect(durationRadio).toBeChecked()
    })

    it('allows switching between duration and deadline modes', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const deadlineRadio = screen.getByLabelText(/deadline mode/i)
      await user.click(deadlineRadio)
      
      expect(deadlineRadio).toBeChecked()
      expect(screen.getByLabelText(/duration mode/i)).not.toBeChecked()
    })

    it('shows duration input when duration mode is selected', () => {
      render(<SetupPhase {...defaultProps} />)
      
      expect(screen.getByLabelText(/session duration/i)).toBeInTheDocument()
      expect(screen.getByDisplayValue('60')).toBeInTheDocument() // Default 60 minutes
    })

    it('shows deadline input when deadline mode is selected', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const deadlineRadio = screen.getByLabelText(/deadline mode/i)
      await user.click(deadlineRadio)
      
      expect(screen.getByLabelText(/target deadline/i)).toBeInTheDocument()
    })

    it('updates session state when time configuration changes', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const durationInput = screen.getByLabelText(/session duration/i)
      await user.clear(durationInput)
      await user.type(durationInput, '90')
      
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          timeConfig: expect.objectContaining({
            mode: 'duration',
            duration: 90 * 60 * 1000 // 90 minutes in milliseconds
          })
        })
      )
    })
  })

  describe('Activity Management', () => {
    it('displays existing activities', () => {
      const sessionWithActivities = createMockSessionState({
        phase: 'setup',
        activities: [
          createMockActivity({ name: 'Task 1', description: 'First task' }),
          createMockActivity({ name: 'Task 2', description: 'Second task' })
        ]
      })

      render(<SetupPhase {...defaultProps} sessionState={sessionWithActivities} />)
      
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })

    it('allows adding new activities', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const addButton = screen.getByRole('button', { name: /add activity/i })
      await user.click(addButton)
      
      expect(screen.getByPlaceholderText(/activity name/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument()
    })

    it('saves new activity when name is provided', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const addButton = screen.getByRole('button', { name: /add activity/i })
      await user.click(addButton)
      
      const nameInput = screen.getByPlaceholderText(/activity name/i)
      const descInput = screen.getByPlaceholderText(/description/i)
      
      await user.type(nameInput, 'New Task')
      await user.type(descInput, 'Task description')
      
      const saveButton = screen.getByRole('button', { name: /save activity/i })
      await user.click(saveButton)
      
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activities: expect.arrayContaining([
            expect.objectContaining({
              name: 'New Task',
              description: 'Task description',
              status: 'pending'
            })
          ])
        })
      )
    })

    it('allows editing existing activities', async () => {
      const user = userEvent.setup()
      const sessionWithActivities = createMockSessionState({
        phase: 'setup',
        activities: [createMockActivity({ name: 'Original Task' })]
      })

      render(<SetupPhase {...defaultProps} sessionState={sessionWithActivities} />)
      
      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)
      
      const nameInput = screen.getByDisplayValue('Original Task')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Task')
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)
      
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activities: expect.arrayContaining([
            expect.objectContaining({
              name: 'Updated Task'
            })
          ])
        })
      )
    })

    it('allows deleting activities', async () => {
      const user = userEvent.setup()
      const activity = createMockActivity({ name: 'Task to Delete' })
      const sessionWithActivities = createMockSessionState({
        phase: 'setup',
        activities: [activity]
      })

      render(<SetupPhase {...defaultProps} sessionState={sessionWithActivities} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)
      
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activities: []
        })
      )
    })
  })

  describe('Session Validation and Start', () => {
    it('disables start button when no activities are defined', () => {
      render(<SetupPhase {...defaultProps} />)
      
      const startButton = screen.getByRole('button', { name: /start session/i })
      expect(startButton).toBeDisabled()
    })

    it('enables start button when activities and time config are valid', () => {
      const validSession = createMockSessionState({
        phase: 'setup',
        activities: [createMockActivity({ name: 'Valid Task' })],
        timeConfig: { mode: 'duration', duration: 60 * 60 * 1000 }
      })

      render(<SetupPhase {...defaultProps} sessionState={validSession} />)
      
      const startButton = screen.getByRole('button', { name: /start session/i })
      expect(startButton).toBeEnabled()
    })

    it('starts session when start button is clicked', async () => {
      const user = userEvent.setup()
      const validSession = createMockSessionState({
        phase: 'setup',
        activities: [createMockActivity({ name: 'Valid Task' })],
        timeConfig: { mode: 'duration', duration: 60 * 60 * 1000 }
      })

      render(<SetupPhase {...defaultProps} sessionState={validSession} />)
      
      const startButton = screen.getByRole('button', { name: /start session/i })
      await user.click(startButton)
      
      expect(mockOnComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionStartTime: expect.any(Date)
        })
      )
    })
  })

  describe('Theme and Accessibility', () => {
    it('applies correct CSS classes for theme compatibility', () => {
      const { container } = render(<SetupPhase {...defaultProps} />)
      
      expect(container.firstChild).toHaveClass('setup-phase')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      // Tab to radio group (duration mode is selected by default)
      await user.tab()
      expect(screen.getByLabelText(/duration mode/i)).toHaveFocus()
      
      // Use arrow key to navigate to deadline mode within radio group
      await user.keyboard('[ArrowDown]')
      expect(screen.getByLabelText(/deadline mode/i)).toHaveFocus()
      
      // Tab to next element (should be duration input when duration mode is active)
      // First switch back to duration mode
      await user.keyboard('[ArrowUp]')
      expect(screen.getByLabelText(/duration mode/i)).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText(/session duration/i)).toHaveFocus()
    })

    it('provides proper ARIA labels and descriptions', () => {
      render(<SetupPhase {...defaultProps} />)
      
      expect(screen.getByRole('radiogroup', { name: /time configuration/i })).toBeInTheDocument()
      expect(screen.getByRole('region', { name: /activities/i })).toBeInTheDocument()
    })

    it('announces important changes to screen readers', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const addButton = screen.getByRole('button', { name: /add activity/i })
      await user.click(addButton)
      
      expect(screen.getByRole('alert')).toHaveTextContent(/activity form opened/i)
    })
  })

  describe('Error Handling', () => {
    it('shows validation errors for invalid inputs', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const durationInput = screen.getByLabelText(/session duration/i)
      await user.clear(durationInput)
      await user.type(durationInput, '0')
      
      expect(screen.getByText(/duration must be greater than 0/i)).toBeInTheDocument()
    })

    it('prevents saving activities with empty names', async () => {
      const user = userEvent.setup()
      render(<SetupPhase {...defaultProps} />)
      
      const addButton = screen.getByRole('button', { name: /add activity/i })
      await user.click(addButton)
      
      const saveButton = screen.getByRole('button', { name: /save activity/i })
      await user.click(saveButton)
      
      expect(screen.getByText(/activity name is required/i)).toBeInTheDocument()
      expect(mockOnStateChange).not.toHaveBeenCalled()
    })
  })
})
