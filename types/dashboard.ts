export interface JiraIssue {
  summary: string;
  issueType: "Story" | "Task" | "Bug";
  assignee: string;
  storyPoints: number;
  startDate: string; // "YYYY-MM-DD"
  closeDate: string; // "YYYY-MM-DD"
  status: string;
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
}