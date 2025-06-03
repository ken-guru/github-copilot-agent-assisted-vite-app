import { useEffect, useState } from 'react'
import './LoadingPhase.css'

export interface LoadingPhaseProps {
  onComplete: () => void
  onThemeDetected?: (theme: 'light' | 'dark') => void
  theme?: 'light' | 'dark'
  minimumLoadTime?: number
}

export const LoadingPhase: React.FC<LoadingPhaseProps> = ({
  onComplete,
  onThemeDetected,
  theme,
  minimumLoadTime = 1000,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Detect system theme preference if not provided
    if (!theme && onThemeDetected) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      onThemeDetected(prefersDark ? 'dark' : 'light')
    }
  }, [theme, onThemeDetected])

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2 // Increment by 2% every interval
      })
    }, minimumLoadTime / 50) // 50 steps to reach 100%

    // Ensure minimum load time
    const loadingTimer = setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      onComplete()
    }, minimumLoadTime)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(loadingTimer)
    }
  }, [minimumLoadTime, onComplete])

  const currentTheme = theme || 'light'

  return (
    <div 
      className="loading-phase"
      data-theme={currentTheme}
      role="status"
      aria-live="polite"
      aria-label="Application is loading"
    >
      <div className="loading-content">
        <div className="loading-header">
          <h1 className="app-title">Mr. Timely</h1>
          <p className="app-description">Time Management & Activity Tracking</p>
        </div>
        
        <div className="loading-progress">
          <div 
            className="progress-bar"
            role="progressbar"
            aria-label="Loading application"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="loading-text">Loading...</span>
        </div>
      </div>
    </div>
  )
}
