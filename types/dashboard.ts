export interface JiraIssue {
  summary: string;
  issueType: "Story" | "Task" | "Bug";
  assignee: string;
  storyPoints: number;
  techStartDate: string; // "YYYY-MM-DD"
  techCloseDate: string; // "YYYY-MM-DD"
  status: string;
}

export interface LeaveEntry {
  developer: string;
  startDate: string; // "DD/MM"
  endDate: string;  // "DD/MM"
}

export interface LeaveDays {
  [key: string]: number;
}

export interface DeveloperMetrics {
  name: string;
  leaves: number;
  availableDays: number;
  rawBandwidth: number;
  adjustedBandwidth: number;
  deliveredStoryPoints: number;
  effectiveVelocity: number;
  leaveDetails: string;
  sprintContribution: number; // Percentage of sprint days the developer was active
}