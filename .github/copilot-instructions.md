# Mr. Timely - GitHub Copilot Instructions

## PREAMBLE
You are working on Mr. Timely, a comprehensive time management and activity tracking application. These instructions ensure consistent, high-quality development that maintains the application's core functionality while following established development protocols. Adherence to these guidelines is critical for project success.

## CORE PRINCIPLES [PRIORITY: HIGHEST]
- Always write tests before implementing functionality
- Maintain thorough documentation with each code change
- Update the Memory Log for all debugging and issue resolution
- Verify code quality through testing, linting, and type checking
- Communicate clearly about implementation choices and alternatives

## TESTING PROTOCOLS [PRIORITY: HIGHEST]

### Test-First Development
- ✅ REQUIRED: Write tests BEFORE implementing any functionality
- Write tests covering basic scenarios, complex scenarios, and edge cases
- Ask clarifying questions about expected behavior before writing tests
- For data display, explicitly test:
  - Order of displayed items
  - Format of displayed values
  - Edge cases in the data

### Test Coverage Management
- Update all relevant tests when refactoring code
- Add specific order verification tests when changing display order or sorting
- Ask clarifying questions if expected test behavior needs to change
- Verify existing edge cases remain covered after changes

### Missing Test Coverage Protocol
- Flag when working with code lacking test coverage
- Present options:
  1. Create tests immediately
  2. Postpone test creation
- If postponement chosen, do not remind again in current session unless requested

### Test Verification
- Remind to run test suite after ANY code changes
- For automated/CI environments or when tests must exit automatically: `npm test -- --run`
- For development/watch mode: `npm test`
- ALWAYS use `--run` flag when running tests in terminal to ensure proper exit

## DOCUMENTATION STANDARDS [PRIORITY: HIGH]

### Component Documentation
- CREATE/UPDATE in docs/components when:
  - Implementing new components
  - Making significant changes to existing components
  - Improving component APIs
- USE TEMPLATE: docs/templates/COMPONENT_DOCUMENTATION_TEMPLATE.md
- MUST INCLUDE:
  - Props documentation (types, defaults)
  - State management approach
  - Theme compatibility
  - Mobile responsiveness details
  - Accessibility considerations
  - Test coverage summary
  - Basic and advanced usage examples
  - Known limitations/edge cases
  - Up-to-date Change History

### Documentation Structure
- Add Navigation section at top of component documentation
- Link back to Component Documentation Index
- Link to related interacting components
- Add component to appropriate category in index
- Ensure component is linked from README.md documentation section

### README Maintenance
- UPDATE when changes alter functionality described in README.md
- EVALUATE after each development cycle for needed updates regarding:
  - New features/functionality
  - Installation/setup changes
  - Usage examples
  - Configuration options
  - Dependencies/requirements

## MEMORY LOG PROTOCOLS [PRIORITY: HIGH]

### File Organization
- Store individual entries in: docs/logged_memories
- Filename format: `MRTMLY-XXX-descriptive-name.md`
- NEVER add detailed entries directly to main MEMORY_LOG.md
- ONLY add reference links in main file pointing to individual entries

### New Entry Creation Process
1. Create new file in docs/logged_memories with proper naming
2. Add entry details using template format
3. Add ONLY a reference link to MEMORY_LOG.md
4. Match existing reference format
5. Add as LAST item
6. NEVER overwrite existing entries
7. Use next available sequential ID number

### Entry Format Requirements
- Follow established template structure
- Include all required sections:
  - Initial State
  - Debug Process/Implementation
  - Resolution
  - Lessons Learned
- Use consistent heading levels
- Apply appropriate tags for searchability

### Debugging Documentation
- Document each debugging step in real-time
- Include ALL solution attempts (successful AND failed)
- Note unexpected behaviors and test failures
- Use appropriate tags for future reference
- Update entries as debugging progresses

## CODE QUALITY STANDARDS [PRIORITY: HIGH]

### Large File Refactoring
- IDENTIFY files exceeding 200 lines
- SUGGEST logical refactoring options:
  - Splitting into smaller modules
  - Creating new components for extracted functionality
  - Improving organization

### Package Management Evaluation
- Before adding new packages, DISCUSS:
  - Specific need addressed
  - Alternative implementation approaches
  - Security implications
  - Added complexity
  - Package maintenance status

### Deployment Verification Checklist
- Type checking:
  ```bash
  npm run type-check
  npm run tsc
  ```
- Linting:
  ```bash
  npm run lint
  ```
- Tests (with automatic exit):
  ```bash
  npm test -- --run
  ```

### Verification Process
- Run all checks before marking work as complete
- Address ALL errors and warnings
- Document deployment-specific considerations in Memory Log
- Tag deployment issues with #deployment

## MR. TIMELY SPECIFIC REQUIREMENTS [PRIORITY: HIGH]

### Application Architecture
- Follow phase-based structure: Loading → Setup → Activity → Completed
- Maintain single source of truth for session state
- Ensure real-time updates without performance degradation
- Implement proper cleanup for timers and intervals

### Core Type System
- Use provided TypeScript interfaces for SessionState, Activity, and TimeConfig
- Maintain strict typing throughout the application
- Validate all state transitions
- Ensure proper error boundaries

### Visual Requirements
- Implement timeline visualization with proportional activity blocks
- Color-code activities consistently across all interface elements
- Progress bar with color transitions (green → yellow → orange → red)
- Support both light and dark themes with smooth transitions

### Accessibility Standards
- Screen reader compatibility with proper ARIA labels
- Full keyboard navigation support
- Focus indicators visible in all themes
- Color is not the only indicator of state
- Semantic HTML structure throughout

### Performance Requirements
- Real-time updates without lag or performance issues
- Efficient rendering of timeline visualizations
- Smooth animations and transitions
- Responsive interface regardless of session length

## COMMUNICATION GUIDELINES [PRIORITY: MEDIUM]

### Change Summary Format
- Provide concise implementation summaries covering:
  - Reasoning behind choices
  - Follow-up question opportunities
  - Alternative approach possibilities

### Implementation Approach
- Prioritize based on immediate developer needs and resources
- Create clear implementation plans with milestones
- Document technical requirements before implementation
- Update Memory Log with progress and challenges
- Review completed work against expected benefits
- Focus on one enhancement at a time

## DEBUGGING TEMPLATE [REFERENCE]

Use this template for all debugging documentation:

```markdown
### Issue: [Test/Feature Name] Debugging Session
**Date:** YYYY-MM-DD
**Tags:** #debugging #tests #[relevant-area]
**Status:** [In Progress|Resolved|Blocked]

#### Initial State
- Description of the failing tests/features
- Error messages or unexpected behavior
- Current implementation state

#### Debug Process
1. First investigation step
   - What was examined
   - What was found
   - Next steps determined

2. Solution attempts
   - What was tried
   - Outcome
   - Why it did/didn't work

#### Resolution (if reached)
- Final solution implemented
- Why it worked
- Tests affected

#### Lessons Learned
- Key insights gained
- Patterns identified
- Future considerations
```

## VERIFICATION CHECKLIST [REFERENCE]

Before marking any work as complete:

1. **Testing**
   - [ ] All new functionality has tests written first
   - [ ] All existing tests still pass
   - [ ] Edge cases are covered
   - [ ] Run `npm test -- --run` successfully

2. **Code Quality** 
   - [ ] TypeScript compilation passes (`npm run type-check`)
   - [ ] Linting passes (`npm run lint`)
   - [ ] No console errors or warnings
   - [ ] Code follows established patterns

3. **Documentation**
   - [ ] Component documentation updated if applicable
   - [ ] Memory log updated for any debugging or significant decisions
   - [ ] README updated if functionality changes

4. **Functionality**
   - [ ] Feature works as specified
   - [ ] Accessibility requirements met
   - [ ] Theme compatibility verified
   - [ ] Mobile responsiveness tested

These instructions ensure that Mr. Timely maintains its high standards of quality, functionality, and user experience throughout development.
