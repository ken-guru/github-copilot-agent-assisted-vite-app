# SetupPhase Component Documentation

## Navigation
- [← Back to Component Documentation Index](README.md)  
- [Related: LoadingPhase Component](LoadingPhase.md)
- [Related: ActivityPhase Component](ActivityPhase.md) *(To be implemented)*

## Overview

The `SetupPhase` component handles the session configuration stage of Mr. Timely, allowing users to set time parameters and define activities before starting their time management session.

## Component API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `sessionState` | `SessionState` | Yes | - | Current session state object |
| `onStateChange` | `(state: SessionState) => void` | Yes | - | Callback fired when session state changes |  
| `onComplete` | `(state: SessionState) => void` | Yes | - | Callback fired when setup is complete |

### Props Documentation

#### `sessionState: SessionState`
The current session state containing:
- `timeConfig`: Current time configuration (duration or deadline mode)
- `activities`: Array of defined activities
- `currentPhase`: Should be 'setup' when this component renders

#### `onStateChange: (state: SessionState) => void`
Called whenever the user modifies the session configuration:
- Time mode changes (duration ↔ deadline)
- Time values updated (duration minutes or deadline datetime)
- Activities added, edited, or removed

#### `onComplete: (state: SessionState) => void`  
Triggered when user clicks "Start Session" button with valid configuration:
- At least one activity defined
- Valid time configuration present
- Adds `sessionStartTime` to state before calling callback

## State Management

### Internal State
- `timeMode`: 'duration' | 'deadline' - Current time configuration mode
- `duration`: number - Session duration in minutes (for duration mode)
- `deadline`: string - Target deadline as datetime-local string (for deadline mode)
- `isAddingActivity`: boolean - Whether activity form is visible
- `activityName`: string - Name input for new/edited activity
- `activityDescription`: string - Description input for new/edited activity  
- `editingActivityId`: string | null - ID of activity being edited
- `errors`: Object containing validation error messages
- `announcements`: string - Screen reader announcements

### State Updates
- Real-time validation with immediate error feedback
- Session state updates propagated via `onStateChange`
- ARIA live region announcements for accessibility

## Theme Compatibility

The component uses CSS custom properties for theming:

```css
--text-primary: Primary text color
--text-secondary: Secondary text color  
--background-secondary: Section background color
--border-color: Border and input colors
--primary-color: Button and accent colors
--error-color: Error message color
```

### Dark Theme Support
- All colors defined via CSS custom properties
- Focus indicators visible in both themes
- High contrast maintained for accessibility

## Mobile Responsiveness

- Responsive padding and spacing using rem units
- Form inputs scale appropriately on mobile devices
- Touch-friendly button and input sizes (minimum 44px)
- Horizontal scrolling prevented with max-width constraints

## Accessibility Features

### Keyboard Navigation
- **Tab Navigation**: Moves between form sections and controls
- **Radio Button Navigation**: Arrow keys navigate within radio groups (only selected radio is tabbable)
- **Form Navigation**: Tab moves through inputs, buttons, and interactive elements

### Screen Reader Support
- **ARIA Live Region**: Announces activity additions, edits, deletions, and errors
- **ARIA Labels**: All form inputs have descriptive labels
- **Radio Group**: Proper `role="radiogroup"` with `aria-label`
- **Semantic HTML**: Uses proper form, fieldset, and legend elements

### Focus Management
- Clear focus indicators on all interactive elements
- Focus trapped appropriately within modal dialogs (activity forms)
- Logical tab order follows visual layout

## Test Coverage

### Test Suites (23 tests total)

#### Basic Rendering (4 tests)
- Component renders with title and instructions
- Time configuration section visible
- Activities management section visible  
- Start session button present

#### Time Configuration (5 tests)
- Defaults to duration mode
- Mode switching between duration/deadline
- Conditional input display based on mode
- Session state updates on configuration changes

#### Activity Management (5 tests)
- Displays existing activities list
- Add new activity functionality
- Edit existing activities
- Delete activities
- Form state management

#### Session Validation and Start (3 tests)
- Start button disabled without activities
- Start button enabled when valid
- Session start with sessionStartTime

#### Theme and Accessibility (3 tests)
- CSS class application for themes
- Keyboard navigation (Tab + Arrow keys)
- ARIA labels and descriptions
- Screen reader announcements

#### Error Handling (3 tests)
- Input validation error display
- Empty activity name prevention
- Real-time error feedback

## Usage Examples

### Basic Usage
```tsx
import { SetupPhase } from './phases/SetupPhase'
import { createInitialSessionState } from './utils/sessionState'

function App() {
  const [sessionState, setSessionState] = useState(createInitialSessionState())
  
  const handleSetupComplete = (completedState) => {
    setSessionState(prev => ({ ...prev, currentPhase: 'activity' }))
    // Proceed to ActivityPhase
  }
  
  return (
    <SetupPhase 
      sessionState={sessionState}
      onStateChange={setSessionState}
      onComplete={handleSetupComplete}
    />
  )
}
```

### Advanced Usage with Validation
```tsx
function AppWithValidation() {
  const [sessionState, setSessionState] = useState(createInitialSessionState())
  const [validationErrors, setValidationErrors] = useState({})
  
  const handleStateChange = (newState) => {
    // Custom validation logic
    const errors = validateSessionState(newState)
    setValidationErrors(errors)
    setSessionState(newState)
  }
  
  const handleSetupComplete = (completedState) => {
    if (Object.keys(validationErrors).length === 0) {
      proceedToNextPhase(completedState)
    }
  }
  
  return (
    <SetupPhase 
      sessionState={sessionState}
      onStateChange={handleStateChange}
      onComplete={handleSetupComplete}
    />
  )
}
```

## Known Limitations

### Current Limitations
- No drag-and-drop reordering of activities
- Limited activity metadata (only name and description)
- No activity templates or presets
- No session configuration persistence across browser sessions

### Future Enhancements
- Activity priority levels and time estimates
- Session template saving/loading
- Advanced time configuration (breaks, intervals)
- Activity categorization and color coding

## Change History

### v1.0.0 - Initial Implementation (2025-06-03)
- ✅ Complete TDD implementation with 23 passing tests
- ✅ Time configuration (duration/deadline modes)
- ✅ Activity management (add/edit/delete)
- ✅ Form validation and error handling
- ✅ Full accessibility support (ARIA, keyboard navigation)
- ✅ Theme compatibility with CSS custom properties
- ✅ Mobile responsive design
- ✅ Screen reader announcements
- ✅ Comprehensive test coverage

## Related Components

- **LoadingPhase**: Previous phase that transitions to SetupPhase
- **ActivityPhase**: Next phase after setup completion  
- **Timeline**: Will display configured activities during session
- **ProgressIndicator**: Will show session progress based on setup configuration

---

*This component follows Mr. Timely's accessibility standards and maintains consistency with the overall application architecture.*
