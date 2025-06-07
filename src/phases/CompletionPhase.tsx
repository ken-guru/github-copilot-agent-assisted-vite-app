import { useMemo } from 'react'
import type { SessionState, SessionStatistics } from '../types'
import './CompletionPhase.css'

interface CompletionPhaseProps {
  sessionState: SessionState
  onRestart: () => void
}

export function CompletionPhase({ sessionState, onRestart }: CompletionPhaseProps) {
  // Calculate session statistics
  const statistics = useMemo((): SessionStatistics => {
    const { activities, activityProgress = [] } = sessionState
    
    // Calculate total planned time
    const totalPlannedTime = activities.reduce((sum, activity) => {
      return sum + (activity.estimatedDuration || 0)
    }, 0)
    
    // Calculate total actual time spent
    const totalActualTime = activityProgress.reduce((sum, progress) => {
      return sum + progress.timeSpent
    }, 0)
    
    // Determine completion status
    let completionStatus: 'early' | 'on-time' | 'overtime' = 'on-time'
    const tolerance = 2 * 60 * 1000 // 2 minutes tolerance
    
    if (totalActualTime < totalPlannedTime - tolerance) {
      completionStatus = 'early'
    } else if (totalActualTime > totalPlannedTime + tolerance) {
      completionStatus = 'overtime'
    }
    
    return {
      totalPlannedTime,
      totalActualTime,
      timeSpentOnActivities: totalActualTime,
      idleTime: 0, // TODO: Calculate idle time if tracking
      overtimeAmount: Math.max(0, totalActualTime - totalPlannedTime),
      completionStatus
    }
  }, [sessionState])

  // Format time duration to human readable format
  const formatDuration = (milliseconds: number): string => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes} min`
    }
    return `${minutes} min`
  }

  // Calculate efficiency percentage
  const efficiency = useMemo(() => {
    if (statistics.totalPlannedTime === 0) return 0
    return Math.round((statistics.totalPlannedTime / statistics.totalActualTime) * 100)
  }, [statistics])

  // Get activity breakdown data
  const activityBreakdown = useMemo(() => {
    return sessionState.activities.map(activity => {
      const progress = sessionState.activityProgress?.find(p => p.activityId === activity.id)
      const planned = activity.estimatedDuration || 0
      const actual = progress?.timeSpent || 0
      const difference = actual - planned
      
      return {
        ...activity,
        plannedTime: planned,
        actualTime: actual,
        difference,
        progress
      }
    })
  }, [sessionState])

  const getStatusLabel = (status: 'early' | 'on-time' | 'overtime'): string => {
    switch (status) {
      case 'early': return 'Completed Early'
      case 'on-time': return 'Completed On Time'
      case 'overtime': return 'Completed Overtime'
    }
  }

  const getTimeDifferenceText = (difference: number): { text: string; type: string } => {
    const absDiff = Math.abs(difference)
    const minutes = Math.floor(absDiff / (1000 * 60))
    
    if (minutes === 0) {
      return { text: 'On time', type: 'exact' }
    } else if (difference < 0) {
      return { text: `${minutes} min under`, type: 'under' }
    } else {
      return { text: `${minutes} min over`, type: 'over' }
    }
  }

  if (!sessionState.activityProgress || sessionState.activityProgress.length === 0) {
    return (
      <div className="completion-phase">
        <div className="completion-header">
          <h1>Session Complete!</h1>
          <div className="no-activities">
            No activities completed
          </div>
        </div>
        <div className="completion-actions">
          <button 
            className="restart-button"
            onClick={onRestart}
            aria-label="Start new session"
          >
            New Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="completion-phase">
      <div className="completion-header">
        <h1>Session Complete!</h1>
        <div className={`session-status ${statistics.completionStatus}`}>
          Session Status: {getStatusLabel(statistics.completionStatus)}
        </div>
        <div className="efficiency-metric">
          <div className="efficiency-value">{efficiency}%</div>
          <div className="efficiency-label">Efficiency</div>
        </div>
      </div>

      <div className="completion-content">
        <div className="summary-section">
          <h2>Summary</h2>
          <div className="time-stats">
            <div className="stat-item">
              <span className="stat-label">Planned Time:</span>
              <span className="stat-value">{formatDuration(statistics.totalPlannedTime)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Actual Time:</span>
              <span className="stat-value">{formatDuration(statistics.totalActualTime)}</span>
            </div>
            {statistics.overtimeAmount > 0 && (
              <div className="stat-item">
                <span className="stat-label">Overtime:</span>
                <span className="stat-value">{formatDuration(statistics.overtimeAmount)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="summary-section">
          <h2>Activity Breakdown</h2>
          <div className="activity-breakdown">
            {activityBreakdown.map(activity => {
              const timeDiff = getTimeDifferenceText(activity.difference)
              return (
                <div key={activity.id} className="activity-item">
                  <div 
                    className="activity-color"
                    style={{ backgroundColor: activity.color }}
                    aria-hidden="true"
                  />
                  <div className="activity-info">
                    <div className="activity-name">{activity.name}</div>
                    <div className="activity-timing">
                      <span>Planned: {formatDuration(activity.plannedTime)}</span>
                      <span>Actual: {formatDuration(activity.actualTime)}</span>
                    </div>
                  </div>
                  <div className={`time-difference ${timeDiff.type}`}>
                    {timeDiff.text}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="completion-actions">
        <button 
          className="restart-button"
          onClick={onRestart}
          aria-label="Start new session"
        >
          New Session
        </button>
      </div>
    </div>
  )
}
