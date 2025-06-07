# ActivityPhase Component Documentation

## Navigation
- [← Component Documentation Index](../README.md#component-documentation)
- [Related Components](#related-components)

## ActivityPhase

The ActivityPhase component is the core component of the Mr. Timely application, responsible for managing the active time tracking session. It provides activity selection, real-time timer functionality, progress tracking, and session completion logic.

## Props

### Interface Definition
```typescript
interface ActivityPhaseProps {
  sessionState: SessionState
  onStateChange: (state: SessionState) => void
  onComplete: (state: SessionState) => void
}
```

### Props Documentation
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| sessionState | `SessionState` | - | Yes | Complete session state including activities, time config, and progress |
| onStateChange | `(state: SessionState) => void` | - | Yes | Callback to update session state in parent component |
| onComplete | `(state: SessionState) => void` | - | Yes | Callback triggered when all activities are completed |

## State Management

The component uses a comprehensive local state management approach:

### Local State Variables
- `selectedActivityId`: Currently selected activity for starting
- `currentActivityId`: Currently active/running activity
- `timeElapsed`: Elapsed time in seconds for current activity
- `isActive`: Boolean indicating if timer is running
- `announcements`: Screen reader announcements for accessibility

### Real-time Timer Management
- Uses `useRef` for interval management to prevent memory leaks
- 1-second interval updates with automatic cleanup
- Persists elapsed time in session state for activity switching

### Activity Progress Tracking
- Tracks start time, time spent, and completion status
- Updates session state with real-time progress
- Handles activity switching without losing progress

## Theme Compatibility

- [x] Light theme support
- [x] Dark theme support
- [x] System theme detection
- [x] Smooth theme transitions
- [x] Color contrast compliance

The component uses CSS custom properties for theming and follows the application's design system with color-coded activity blocks and progress indicators.

## Mobile Responsiveness

- [x] Mobile layout adaptation
- [x] Touch interaction optimization
- [x] Responsive breakpoint handling
- [x] Mobile-specific features

Features responsive grid layouts, touch-friendly button sizing, and mobile-optimized timeline visualization.

## Accessibility

- [x] Screen reader compatibility
- [x] Keyboard navigation support
- [x] ARIA labels and roles
- [x] Focus management
- [x] Color-independent state indication

### Accessibility Features
- Live region for timer announcements
- Comprehensive keyboard shortcuts (Space, Enter, P, R, C)
- ARIA labels for all interactive elements
- Progress indication through multiple channels (visual, textual, ARIA)
- Screen reader announcements for activity state changes

## Usage Examples

### Basic Usage
```tsx
<ActivityPhase 
  sessionState={sessionState}
  onStateChange={handleStateChange}
  onComplete={handleSessionComplete}
/>
```

### With Session State
```tsx
const [sessionState, setSessionState] = useState<SessionState>({
  activities: [
    { id: '1', name: 'Planning', duration: 15, color: '#3b82f6' },
    { id: '2', name: 'Development', duration: 45, color: '#10b981' }
  ],
  timeConfig: { totalMinutes: 60, breakMinutes: 5 },
  activityProgress: []
})

<ActivityPhase 
  sessionState={sessionState}
  onStateChange={setSessionState}
  onComplete={(finalState) => {
    console.log('Session completed!', finalState)
    // Navigate to completion phase
  }}
/>
```

## Key Features

### Activity Management
- Activity selection with visual feedback
- Real-time activity switching
- Progress preservation across switches
- Automatic completion detection

### Timer Functionality
- Precise 1-second interval updates
- Pause/resume capability
- Automatic cleanup on component unmount
- Visual progress indicators with color transitions

### Timeline Visualization
- Proportional activity blocks based on planned duration
- Color-coded activities with consistent theming
- Real-time progress updates
- Responsive design for various screen sizes

### Keyboard Shortcuts
- **Space**: Start selected activity
- **Enter**: Start selected activity (alternative)
- **P**: Pause current activity
- **R**: Resume paused activity
- **C**: Complete current activity

## Test Coverage Summary

- [x] Basic rendering tests
- [x] Props validation tests
- [x] User interaction tests
- [x] Edge case handling
- [x] Accessibility tests

### Test Files
- `ActivityPhase.test.tsx` - Main test file with 19 comprehensive tests
- Tests cover activity selection, timer functionality, keyboard shortcuts, state management, and accessibility features

### Test Categories
1. **Rendering Tests**: Component displays correctly with various props
2. **Activity Selection**: Click and keyboard selection behaviors
3. **Timer Operations**: Start, pause, resume, complete functionality
4. **State Management**: Progress tracking and session state updates
5. **Accessibility**: Screen reader support and keyboard navigation
6. **Edge Cases**: Error handling and boundary conditions

## Known Limitations

1. **Performance**: With large numbers of activities (100+), the timeline visualization may impact performance
2. **Timer Precision**: Uses 1-second intervals; may drift slightly over very long sessions
3. **Browser Background**: Timer may slow down when browser tab is inactive (browser limitation)
4. **Activity Switching**: Current implementation requires manual completion before switching activities

## Related Components

- [SetupPhase](./SetupPhase.md) - Precedes ActivityPhase, provides session configuration
- [LoadingPhase](./LoadingPhase.md) - Initial application loading state
- CompletionPhase - Follows ActivityPhase (pending implementation)

## Change History

### Version 1.0.0 (2025-06-07)
- Resolved React Hook warnings by implementing useCallback for all activity management functions
- Added missing dependencies to useEffect hooks for proper re-rendering
- Improved code quality and performance optimization

### Version 0.9.0 (2025-06-04)
- Initial implementation with comprehensive test coverage
- Full TDD development approach with 19 test cases
- Real-time timer functionality with activity switching
- Complete accessibility implementation
- Timeline visualization with proportional activity blocks
- Keyboard shortcut support for all major actions
- Integration with session state management
