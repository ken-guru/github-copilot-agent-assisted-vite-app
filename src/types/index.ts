/**
 * Core type definitions for Mr. Timely application
 */

export interface TimeConfig {
  mode: 'duration' | 'deadline';
  duration?: number; // milliseconds
  deadline?: Date;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'active' | 'completed';
  startTime?: Date;
  endTime?: Date;
  color: string;
}

export interface SessionState {
  phase: 'loading' | 'setup' | 'activity' | 'completed';
  timeConfig?: TimeConfig;
  activities: Activity[];
  sessionStartTime?: Date;
  activeActivityId?: string;
}

export interface ThemePreference {
  mode: 'light' | 'dark' | 'system';
}

export interface SessionStatistics {
  totalPlannedTime: number; // milliseconds
  totalActualTime: number; // milliseconds
  timeSpentOnActivities: number; // milliseconds
  idleTime: number; // milliseconds
  overtimeAmount: number; // milliseconds (0 if not overtime)
  completionStatus: 'early' | 'on-time' | 'overtime';
}

export interface TimelineEvent {
  id: string;
  type: 'activity-start' | 'activity-end' | 'break';
  timestamp: Date;
  activityId?: string;
  duration?: number; // milliseconds, for breaks
}
