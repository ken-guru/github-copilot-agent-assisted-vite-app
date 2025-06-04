import { useState } from 'react'
import { LoadingPhase } from './phases/LoadingPhase'
import { SetupPhase } from './phases/SetupPhase'
import { ActivityPhase } from './phases/ActivityPhase'
import type { SessionState } from './types'
import './App.css'

function App() {
  const [sessionState, setSessionState] = useState<SessionState>({
    phase: 'loading',
    activities: []
  })

  const handleLoadingComplete = () => {
    setSessionState(prev => ({
      ...prev,
      phase: 'setup'
    }))
  }

  const handleSetupStateChange = (newState: SessionState) => {
    setSessionState(newState)
  }

  const handleSetupComplete = (completedState: SessionState) => {
    setSessionState({
      ...completedState,
      phase: 'activity'
    })
  }

  const handleActivityStateChange = (newState: SessionState) => {
    setSessionState(newState)
  }

  const handleActivityComplete = (completedState: SessionState) => {
    setSessionState({
      ...completedState,
      phase: 'completed'
    })
  }

  const renderCurrentPhase = () => {
    switch (sessionState.phase) {
      case 'loading':
        return <LoadingPhase onComplete={handleLoadingComplete} />
      case 'setup':
        return (
          <SetupPhase 
            sessionState={sessionState}
            onStateChange={handleSetupStateChange}
            onComplete={handleSetupComplete}
          />
        )
      case 'activity':
        return (
          <ActivityPhase
            sessionState={sessionState}
            onStateChange={handleActivityStateChange}
            onComplete={handleActivityComplete}
          />
        )
      case 'completed':
        return <div>Completion Phase - Coming Soon!</div>
      default:
        return <div>Unknown Phase</div>
    }
  }

  return (
    <div className="mr-timely-app">
      {renderCurrentPhase()}
    </div>
  )
}

export default App
