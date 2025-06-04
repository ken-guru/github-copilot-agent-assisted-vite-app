# Mr. Timely

A comprehensive time management and activity tracking application that helps users plan, execute, and review focused work sessions.

## Features

- **Phase-based Workflow**: Guided progression from setup to completion
- **Activity Management**: Create, track, and manage activities with real-time feedback
- **Visual Timeline**: Proportional activity blocks with color coding
- **Progress Tracking**: Real-time progress indicators with color transitions
- **Theme Support**: Light and dark modes with system preference detection
- **Accessibility**: Full keyboard navigation and screen reader support
- **Offline Functionality**: Complete functionality without network connection

## Current Status

**🎯 MILESTONE: ActivityPhase Implementation Complete**  
All core phases now functional with comprehensive test coverage (50/50 tests passing).

### ✅ Completed Features
- **Loading Phase**: Auto-advancing splash screen with accessibility
- **Setup Phase**: Time configuration and activity creation with full TDD coverage  
- **Activity Phase**: Real-time session management with timer controls, activity switching, and progress tracking
- **Full Test Coverage**: 50 passing tests across all components
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **TypeScript**: Strict typing throughout application

### 🚀 Ready for Use
The application is fully functional for time management sessions:
1. Configure session duration (timer/deadline modes)
2. Create and customize activities  
3. Run active sessions with real-time progress tracking
4. Switch between activities during sessions
5. Complete activities and track overall progress

### 🔄 Next Phase
- CompletionPhase implementation for session summary
- Enhanced timeline visualizations
- Theme system and mobile responsiveness

## Application Flow

1. **Loading Phase**: Initialization with theme detection
2. **Setup Phase**: Configure session timing (duration or deadline-based)
3. **Activity Phase**: Manage activities with real-time tracking
4. **Completion Phase**: Review session statistics and activity summary

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts

```bash
# Development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm test:ui

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## Project Structure

```
/src
  /components      # Reusable UI components
  /phases         # Phase-specific components (Setup, Activity, Summary)
  /hooks          # Custom hooks for state management
  /utils          # Utility functions
  /types          # TypeScript type definitions
  /styles         # Theme and styling
  /tests          # Test files
/docs
  /components     # Component documentation
  /logged_memories # Memory log entries
  /templates      # Documentation templates
```

## Architecture

### Core Types

- **SessionState**: Main application state management
- **Activity**: Individual activity tracking and lifecycle
- **TimeConfig**: Session timing configuration
- **ThemePreference**: Theme system settings

### State Management

The application uses React's built-in state management with custom hooks for:
- Session state coordination
- Timer management with proper cleanup
- Activity lifecycle management
- Theme preference persistence

### Testing Strategy

- **Test-First Development**: All functionality implemented with tests first
- **Component Testing**: @testing-library/react for UI components
- **Unit Testing**: Vitest for logic and utility functions
- **Integration Testing**: Full user workflow testing

## Development Guidelines

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint configuration for code consistency
- Comprehensive test coverage required
- Documentation for all components

### Accessibility Requirements
- ARIA labels and semantic HTML
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### Performance Requirements
- Real-time updates without lag
- Efficient timeline visualizations
- Smooth animations and transitions
- Mobile-responsive design

## Component Documentation

- [Component Documentation Index](docs/components/README.md)

## Contributing

1. Follow test-first development approach
2. Update documentation for any component changes
3. Ensure all tests pass before committing
4. Update Memory Log for debugging sessions

## License

MIT License
    ...reactDom.configs.recommended.rules,
  },
})
```
