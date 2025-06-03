import { useState } from 'react'
import { LoadingPhase } from './phases/LoadingPhase'
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

  const renderCurrentPhase = () => {
    switch (sessionState.phase) {
      case 'loading':
        return <LoadingPhase onComplete={handleLoadingComplete} />
      case 'setup':
        return <div>Setup Phase - Coming Soon!</div>
      case 'activity':
        return <div>Activity Phase - Coming Soon!</div>
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
