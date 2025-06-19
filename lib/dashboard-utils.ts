import { JiraIssue, LeaveDays, DeveloperMetrics } from '@/types/dashboard';

export function calculateDeveloperMetrics(
  jiraIssues: JiraIssue[],
  leaveDays: LeaveDays
): DeveloperMetrics[] {
  const TOTAL_WORKING_DAYS = 10;
  const STORY_POINTS_PER_DAY = 4;
  const BUG_DEDUCTION_PERCENTAGE = 0.2;

  // Group issues by assignee
  const issuesByDeveloper: { [key: string]: JiraIssue[] } = {};
  
  jiraIssues.forEach(issue => {
    if (!issuesByDeveloper[issue.assignee]) {
      issuesByDeveloper[issue.assignee] = [];
    }
    issuesByDeveloper[issue.assignee].push(issue);
  });

  // Get all unique developers
  const allDevelopers = new Set([
    ...Object.keys(issuesByDeveloper),
    ...Object.keys(leaveDays)
  ]);

  return Array.from(allDevelopers).map(developer => {
    const developerIssues = issuesByDeveloper[developer] || [];
    const leaves = leaveDays[developer] || 0;
    
    // Calculate metrics
    const availableDays = TOTAL_WORKING_DAYS - leaves;
    const rawBandwidth = availableDays * STORY_POINTS_PER_DAY;
    const adjustedBandwidth = rawBandwidth * (1 - BUG_DEDUCTION_PERCENTAGE);
    
    // Calculate delivered story points (only "Done" issues)
    const deliveredStoryPoints = developerIssues
      .filter(issue => issue.status === 'Done')
      .reduce((sum, issue) => sum + issue.storyPoints, 0);
    
    // Calculate effective velocity
    const effectiveVelocity = adjustedBandwidth > 0 ? deliveredStoryPoints / adjustedBandwidth : 0;

    return {
      name: developer,
      leaves,
      availableDays,
      rawBandwidth,
      adjustedBandwidth,
      deliveredStoryPoints,
      effectiveVelocity
    };
  }).sort((a, b) => b.effectiveVelocity - a.effectiveVelocity); // Sort by velocity descending
}

export function formatVelocity(velocity: number): string {
  return `${velocity.toFixed(2)}x`;
}

export function getVelocityColor(velocity: number): string {
  if (velocity >= 0.9) return 'text-green-600';
  if (velocity >= 0.7) return 'text-yellow-600';
  return 'text-red-600';
}

export function getVelocityBadgeColor(velocity: number): string {
  if (velocity >= 0.9) return 'bg-green-100 text-green-800';
  if (velocity >= 0.7) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}