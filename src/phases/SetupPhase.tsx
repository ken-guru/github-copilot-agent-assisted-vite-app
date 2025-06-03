import React, { useState, useEffect } from 'react'
import type { SessionState, TimeConfig, Activity } from '../types'
import './SetupPhase.css'

interface SetupPhaseProps {
  sessionState: SessionState
  onComplete: (sessionState: SessionState) => void
  onStateChange: (sessionState: SessionState) => void
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  sessionState,
  onComplete,
  onStateChange
}) => {
  // Local state for form inputs
  const [timeMode, setTimeMode] = useState<'duration' | 'deadline'>('duration')
  const [duration, setDuration] = useState(60) // minutes
  const [deadline, setDeadline] = useState('')
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [activityName, setActivityName] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [announcements, setAnnouncements] = useState('')

  // Initialize time config from session state
  useEffect(() => {
    if (sessionState.timeConfig) {
      setTimeMode(sessionState.timeConfig.mode)
      if (sessionState.timeConfig.duration) {
        setDuration(sessionState.timeConfig.duration / (60 * 1000)) // convert ms to minutes
      }
      if (sessionState.timeConfig.deadline) {
        const deadlineDate = new Date(sessionState.timeConfig.deadline)
        setDeadline(deadlineDate.toISOString().slice(0, 16)) // format for datetime-local
      }
    }
  }, [sessionState.timeConfig])

  // Update session state when time configuration changes
  const updateTimeConfig = (newTimeConfig: TimeConfig) => {
    const updatedState = {
      ...sessionState,
      timeConfig: newTimeConfig
    }
    onStateChange(updatedState)
  }

  const handleTimeModeChange = (mode: 'duration' | 'deadline') => {
    setTimeMode(mode)
    const newTimeConfig: TimeConfig = {
      mode,
      ...(mode === 'duration' ? { duration: duration * 60 * 1000 } : {}),
      ...(mode === 'deadline' && deadline ? { deadline: new Date(deadline) } : {})
    }
    updateTimeConfig(newTimeConfig)
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    
    // Validate duration
    if (newDuration <= 0) {
      setErrors(prev => ({ ...prev, duration: 'Duration must be greater than 0' }))
    } else {
      setErrors(prev => ({ ...prev, duration: '' }))
      const newTimeConfig: TimeConfig = {
        mode: 'duration',
        duration: newDuration * 60 * 1000 // convert minutes to ms
      }
      updateTimeConfig(newTimeConfig)
    }
  }

  const handleDeadlineChange = (newDeadline: string) => {
    setDeadline(newDeadline)
    if (newDeadline) {
      const newTimeConfig: TimeConfig = {
        mode: 'deadline',
        deadline: new Date(newDeadline)
      }
      updateTimeConfig(newTimeConfig)
    }
  }

  const startAddingActivity = () => {
    setIsAddingActivity(true)
    setActivityName('')
    setActivityDescription('')
    setEditingActivityId(null)
    setAnnouncements('Activity form opened')
  }

  const startEditingActivity = (activity: Activity) => {
    setIsAddingActivity(true)
    setEditingActivityId(activity.id)
    setActivityName(activity.name)
    setActivityDescription(activity.description || '')
    setAnnouncements('Editing activity')
  }

  const saveActivity = () => {
    // Validate activity name
    if (!activityName.trim()) {
      setErrors(prev => ({ ...prev, activityName: 'Activity name is required' }))
      return
    }

    setErrors(prev => ({ ...prev, activityName: '' }))

    const newActivity: Activity = {
      id: editingActivityId || `activity-${Date.now()}`,
      name: activityName.trim(),
      description: activityDescription.trim() || undefined,
      status: 'pending',
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)` // Random color
    }

    let updatedActivities: Activity[]
    if (editingActivityId) {
      // Edit existing activity
      updatedActivities = sessionState.activities.map(activity =>
        activity.id === editingActivityId ? newActivity : activity
      )
    } else {
      // Add new activity
      updatedActivities = [...sessionState.activities, newActivity]
    }

    const updatedState = {
      ...sessionState,
      activities: updatedActivities
    }
    onStateChange(updatedState)

    // Reset form
    setIsAddingActivity(false)
    setEditingActivityId(null)
    setActivityName('')
    setActivityDescription('')
    setAnnouncements(editingActivityId ? 'Activity updated' : 'Activity added')
  }

  const deleteActivity = (activityId: string) => {
    const updatedActivities = sessionState.activities.filter(
      activity => activity.id !== activityId
    )
    const updatedState = {
      ...sessionState,
      activities: updatedActivities
    }
    onStateChange(updatedState)
    setAnnouncements('Activity deleted')
  }

  const cancelActivityForm = () => {
    setIsAddingActivity(false)
    setEditingActivityId(null)
    setActivityName('')
    setActivityDescription('')
    setErrors(prev => ({ ...prev, activityName: '' }))
  }

  const handleStartSession = () => {
    const updatedState = {
      ...sessionState,
      sessionStartTime: new Date()
    }
    onComplete(updatedState)
  }

  const isSessionValid = sessionState.activities.length > 0 && sessionState.timeConfig

  return (
    <div className="setup-phase">
      <h1>Session Setup</h1>
      <p>Configure your time management session</p>
      
      {/* Announcements for screen readers */}
      {announcements && (
        <div role="alert" aria-live="polite" className="sr-only">
          {announcements}
        </div>
      )}
      
      {/* Time Configuration Section */}
      <section>
        <h2>Time Configuration</h2>
        <div role="radiogroup" aria-label="Time Configuration">
          <label>
            <input 
              type="radio" 
              name="timeMode" 
              value="duration"
              checked={timeMode === 'duration'}
              onChange={() => handleTimeModeChange('duration')}
            />
            Duration Mode
          </label>
          <label>
            <input 
              type="radio" 
              name="timeMode" 
              value="deadline"
              checked={timeMode === 'deadline'} 
              onChange={() => handleTimeModeChange('deadline')}
            />
            Deadline Mode
          </label>
        </div>
        
        <div className="time-inputs">
          {timeMode === 'duration' && (
            <label>
              Session Duration (minutes):
              <input 
                type="number" 
                value={duration}
                onChange={(e) => handleDurationChange(Number(e.target.value))}
                aria-label="Session Duration" 
                min="1"
              />
              {errors.duration && (
                <span className="error-message">{errors.duration}</span>
              )}
            </label>
          )}
          
          {timeMode === 'deadline' && (
            <label>
              Target Deadline:
              <input 
                type="datetime-local" 
                value={deadline}
                onChange={(e) => handleDeadlineChange(e.target.value)}
                aria-label="Target Deadline" 
              />
            </label>
          )}
        </div>
      </section>

      {/* Activities Section */}
      <section role="region" aria-label="Activities">
        <h2>Activities</h2>
        <button type="button" onClick={startAddingActivity}>
          Add Activity
        </button>
        
        {/* Activity Form */}
        {isAddingActivity && (
          <div className="activity-form">
            <input
              type="text"
              placeholder="Activity name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              aria-label="Activity name"
            />
            {errors.activityName && (
              <span className="error-message">{errors.activityName}</span>
            )}
            <input
              type="text"
              placeholder="Description (optional)"
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              aria-label="Activity description"
            />
            <div className="form-buttons">
              <button type="button" onClick={saveActivity}>
                {editingActivityId ? 'Save' : 'Save Activity'}
              </button>
              <button type="button" onClick={cancelActivityForm}>
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Activity List */}
        <div className="activity-list">
          {sessionState.activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <span className="activity-name">{activity.name}</span>
              {activity.description && (
                <span className="activity-description">{activity.description}</span>
              )}
              <div className="activity-actions">
                <button type="button" onClick={() => startEditingActivity(activity)}>
                  Edit
                </button>
                <button type="button" onClick={() => deleteActivity(activity.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Start Session */}
      <button 
        type="button" 
        disabled={!isSessionValid}
        onClick={handleStartSession}
        className="start-session-button"
      >
        Start Session
      </button>
    </div>
  )
}
