export interface JiraIssue {
  summary: string;
  issueType: "Story" | "Task" | "Bug";
  assignee: string;
  storyPoints: number;
  techStartDate: string;
  techCloseDate: string;
  status: string;
}

export interface LeaveEntry {
  developer: string;
  startDate: string;
  endDate: string;
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
  sprintContribution: number;
}