import { useState, useEffect, useRef, useCallback } from 'react'
import type { SessionState, ActivityProgress } from '../types'
import './ActivityPhase.css'

interface ActivityPhaseProps {
  sessionState: SessionState
  onStateChange: (state: SessionState) => void
  onComplete: (state: SessionState) => void
}

export function ActivityPhase({ sessionState, onStateChange, onComplete }: ActivityPhaseProps) {
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [announcements, setAnnouncements] = useState('')
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Get selectedActivityId from sessionState, with fallback to first activity
  const selectedActivityId = sessionState.selectedActivityId || (sessionState.activities.length > 0 ? sessionState.activities[0].id : null)
  
  // Helper functions
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate session elapsed time from activity progress
  const getTotalTimeSpent = (): number => {
    const progress = sessionState.activityProgress || []
    const totalMs = progress.reduce((total, p) => total + (p.timeSpent || 0), 0)
    return Math.floor(totalMs / 1000) // Convert to seconds
  }

  const sessionElapsed = getTotalTimeSpent() + (isActive ? timeElapsed : 0)

  const calculateProgress = (): number => {
    if (!sessionState.timeConfig?.duration) return 0
    const totalTime = sessionState.timeConfig.duration / 1000 // Convert to seconds
    return Math.min(100, (sessionElapsed / totalTime) * 100)
  }

  const getActivityProgress = useCallback((activityId: string) => {
    return sessionState.activityProgress?.find(p => p.activityId === activityId)
  }, [sessionState.activityProgress])

  const updateActivityProgress = useCallback((activityId: string, updates: Partial<ActivityProgress>) => {
    const currentProgress = sessionState.activityProgress || []
    const existingProgress = currentProgress.find(p => p.activityId === activityId)
    
    let updatedProgress
    if (existingProgress) {
      updatedProgress = currentProgress.map(p => 
        p.activityId === activityId ? { ...p, ...updates } : p
      )
    } else {
      updatedProgress = [...currentProgress, {
        activityId,
        completed: false,
        timeSpent: 0,
        ...updates
      }]
    }
    
    const updatedState = {
      ...sessionState,
      activityProgress: updatedProgress
    }
    
    onStateChange(updatedState)
    return updatedState
  }, [sessionState, onStateChange])

  const getProgressColor = (progress: number): string => {
    if (progress < 50) return 'progress-green'
    if (progress < 75) return 'progress-yellow'
    if (progress < 90) return 'progress-orange'
    return 'progress-red'
  }

  const getCurrentActivity = useCallback(() => {
    return sessionState.activities.find(a => a.id === currentActivityId)
  }, [sessionState.activities, currentActivityId])



  // Timer management
  const startTimer = useCallback(() => {
    if (intervalRef.current) return
    
    startTimeRef.current = Date.now() - timeElapsed * 1000
    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current && currentActivityId) {
        const newElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setTimeElapsed(newElapsed)
        
        // Update session state with current progress
        updateActivityProgress(currentActivityId, {
          timeSpent: newElapsed * 1000 // Convert to milliseconds
        })
      }
    }, 1000)
  }, [timeElapsed, currentActivityId, updateActivityProgress])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Activity actions
  const selectActivity = (activityId: string) => {
    onStateChange({
      ...sessionState,
      selectedActivityId: activityId
    })
    const activity = sessionState.activities.find(a => a.id === activityId)
    if (activity) {
      setAnnouncements(`Selected activity: ${activity.name}`)
    }
  }

  const startActivity = useCallback(() => {
    if (!selectedActivityId) return
    
    // Stop current activity if running
    if (isActive) {
      stopTimer()
    }

    setCurrentActivityId(selectedActivityId)
    setTimeElapsed(0)
    setIsActive(true)
    startTimer()
    
    // Update session state with active activity
    onStateChange({
      ...sessionState,
      activeActivityId: selectedActivityId
    })
    
    const activity = sessionState.activities.find(a => a.id === selectedActivityId)
    if (activity) {
      setAnnouncements(`Started activity: ${activity.name}`)
    }
  }, [selectedActivityId, isActive, stopTimer, startTimer, onStateChange, sessionState, setAnnouncements])

  const pauseActivity = useCallback(() => {
    setIsActive(false)
    stopTimer()
    setAnnouncements('Activity paused')
    
    // Update session state to clear active activity
    onStateChange({
      ...sessionState,
      activeActivityId: null
    })
  }, [stopTimer, setAnnouncements, onStateChange, sessionState])

  const resumeActivity = useCallback(() => {
    setIsActive(true)
    startTimer()
    setAnnouncements('Activity resumed')
    
    // Update session state with active activity
    if (currentActivityId) {
      onStateChange({
        ...sessionState,
        activeActivityId: currentActivityId
      })
    }
  }, [startTimer, setAnnouncements, currentActivityId, onStateChange, sessionState])

  const completeActivity = useCallback(() => {
    if (!currentActivityId) return
    
    stopTimer()
    setIsActive(false)
    
    // Update activity progress
    const updatedState = updateActivityProgress(currentActivityId, {
      completed: true,
      timeSpent: timeElapsed * 1000, // Convert to milliseconds
      endTime: new Date()
    })
    
    const activity = getCurrentActivity()
    if (activity) {
      setAnnouncements(`${activity.name} completed`)
    }
    
    // Check if all activities are completed
    const allActivities = sessionState.activities
    const allProgress = updatedState.activityProgress || []
    const allCompleted = allActivities.every(activity => 
      allProgress.some(progress => 
        progress.activityId === activity.id && progress.completed
      )
    )
    
    if (allCompleted) {
      onComplete(updatedState)
      return
    }
    
    // Reset for next activity
    setCurrentActivityId(null)
    onStateChange({
      ...sessionState,
      selectedActivityId: undefined
    })
    setTimeElapsed(0)
  }, [currentActivityId, stopTimer, timeElapsed, updateActivityProgress, getCurrentActivity, setAnnouncements, sessionState, onComplete, onStateChange])

  const switchActivity = (newActivityId: string) => {
    if (currentActivityId && isActive) {
      // Save current progress
      const currentProgress = getActivityProgress(currentActivityId)
      const previousTimeSpent = currentProgress?.timeSpent || 0
      updateActivityProgress(currentActivityId, {
        timeSpent: previousTimeSpent + (timeElapsed * 1000) // Convert to milliseconds
      })
    }
    
    stopTimer()
    setCurrentActivityId(newActivityId)
    onStateChange({
      ...sessionState,
      selectedActivityId: newActivityId
    })
    setTimeElapsed(0)
    setIsActive(true)
    startTimer()
    
    const activity = sessionState.activities.find(a => a.id === newActivityId)
    if (activity) {
      setAnnouncements(`Switched to activity: ${activity.name}`)
    }
  }

  // Initialize component state from session state
  useEffect(() => {
    if (sessionState.activeActivityId && sessionState.activeActivityId !== currentActivityId) {
      setCurrentActivityId(sessionState.activeActivityId)
      setIsActive(true)
      
      // Set start time based on existing progress if available
      const progress = getActivityProgress(sessionState.activeActivityId)
      if (progress?.startTime) {
        const elapsed = progress.timeSpent ? Math.floor(progress.timeSpent / 1000) : 0
        setTimeElapsed(elapsed)
      }
    }
  }, [sessionState.activeActivityId, currentActivityId, getActivityProgress])

  // Start timer when current activity changes and is active
  useEffect(() => {
    if (currentActivityId && isActive && !intervalRef.current) {
      startTimer()
    } else if (!currentActivityId || !isActive) {
      stopTimer()
    }
  }, [currentActivityId, isActive, startTimer, stopTimer])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Session completion check
  useEffect(() => {
    if (!sessionState.timeConfig?.duration) return
    
    const totalTime = sessionState.timeConfig.duration / 1000 // Convert to seconds
    if (sessionElapsed >= totalTime) {
      stopTimer()
      setIsActive(false)
      onComplete(sessionState)
    }
  }, [sessionElapsed, sessionState, onComplete, stopTimer])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case ' ':
            e.preventDefault()
            if (isActive) {
              pauseActivity()
            } else if (currentActivityId) {
              resumeActivity()
            } else if (selectedActivityId) {
              startActivity()
            }
            break
          case 'Enter':
            e.preventDefault()
            if (currentActivityId && isActive) {
              completeActivity()
            } else if (selectedActivityId) {
              startActivity()
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isActive, currentActivityId, selectedActivityId, pauseActivity, resumeActivity, startActivity, completeActivity])

  // Validation checks
  if (!sessionState.timeConfig) {
    return (
      <div className="activity-phase error">
        <h1>Session Configuration Error</h1>
        <p>Session configuration is missing. Please restart the session.</p>
      </div>
    )
  }

  if (!sessionState.activities || sessionState.activities.length === 0) {
    return (
      <div className="activity-phase error">
        <h1>No Activities Defined</h1>
        <p>No activities were configured for this session.</p>
      </div>
    )
  }

  if (!sessionState.sessionStartTime) {
    return (
      <div className="activity-phase error">
        <h1>Session Start Time Missing</h1>
        <p>Session start time is not available.</p>
      </div>
    )
  }

  return (
    <div className="activity-phase" data-testid="activity-phase">
      <h1>Active Session</h1>
      <p>Session Progress</p>
      
      {/* Announcements for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcements}
      </div>

      {/* Session Information */}
      <section>
        <h2>Total Session Time</h2>
        <p>
          Time Remaining: {sessionState.timeConfig?.duration 
            ? formatTime((sessionState.timeConfig.duration / 1000) - sessionElapsed)
            : 'Unknown'
          }
        </p>
        <p>Session Elapsed: {formatTime(sessionElapsed)}</p>
      </section>

      {/* Activity Timeline */}
      <section role="region" aria-label="Activity Timeline">
        <h2>Session Timeline</h2>
        <div data-testid="activity-timeline">
          {sessionState.activities.map((activity) => {
            const progress = getActivityProgress(activity.id)
            const isSelected = selectedActivityId === activity.id
            const isCurrent = currentActivityId === activity.id
            const isCompleted = progress?.completed || false
            const activityTimeSpent = progress?.timeSpent || 0
            const estimatedDuration = activity.estimatedDuration || 0
            const progressPercentage = estimatedDuration > 0 
              ? Math.min(100, (activityTimeSpent / estimatedDuration) * 100)
              : 0

            return (
              <div 
                key={activity.id} 
                data-testid={`timeline-${activity.id}`}
                className={`timeline-activity ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => selectActivity(activity.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    selectActivity(activity.id)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${activity.name} activity`}
                style={{ backgroundColor: activity.color }}
              >
                {activity.name}
                <div 
                  data-testid={`${activity.id}-progress`} 
                  className="activity-progress-bar"
                  style={{ width: `${progressPercentage}%` }}
                />
                {isCurrent && (
                  <div className="current-indicator">Current</div>
                )}
                {isCompleted && (
                  <div className="completed-indicator">✓</div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Progress Indicator */}
      <section>
        <div 
          role="progressbar" 
          aria-label="Session Progress"
          aria-valuenow={Math.round(calculateProgress())}
          aria-valuemin={0}
          aria-valuemax={100}
          className={getProgressColor(calculateProgress())}
        >
          {Math.round(calculateProgress())}%
        </div>
      </section>

      {/* Activity Controls */}
      <section>
        <h2>Current Activity</h2>
        <p>
          Selected: {selectedActivityId 
            ? sessionState.activities.find(a => a.id === selectedActivityId)?.name || 'None'
            : 'None'
          }
        </p>
        
        {currentActivityId && (
          <p>
            Current: {getCurrentActivity()?.name || 'None'} - 
            Elapsed: {formatTime(timeElapsed)}
          </p>
        )}

        <div className="activity-controls">
          {!currentActivityId && selectedActivityId && (
            <button 
              type="button" 
              onClick={startActivity}
              aria-label="Start Activity"
            >
              Start Activity
            </button>
          )}
          
          {currentActivityId && isActive && (
            <button 
              type="button" 
              onClick={pauseActivity}
              aria-label="Pause Activity"
            >
              Pause
            </button>
          )}
          
          {currentActivityId && !isActive && (
            <button 
              type="button" 
              onClick={resumeActivity}
              aria-label="Resume Activity"
            >
              Resume
            </button>
          )}
          
          {currentActivityId && (
            <button 
              type="button" 
              onClick={completeActivity}
              aria-label="Complete Activity"
            >
              Complete
            </button>
          )}
        </div>

        {/* Activity switching buttons */}
        {sessionState.activities.length > 1 && (
          <div className="activity-switcher">
            <h3>Switch to Activity:</h3>
            {sessionState.activities
              .filter(activity => activity.id !== currentActivityId)
              .map(activity => {
                const progress = getActivityProgress(activity.id)
                const isCompleted = progress?.completed || false
                
                return (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => switchActivity(activity.id)}
                    disabled={isCompleted}
                    aria-label={`Switch to ${activity.name}`}
                  >
                    {activity.name} {isCompleted ? '(Completed)' : ''}
                  </button>
                )
              })
            }
          </div>
        )}
      </section>
    </div>
  )
}
