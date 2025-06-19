import { JiraIssue, DeveloperMetrics } from '@/types/dashboard';
import { calculateSprintContribution, getWorkingDays } from '@/lib/utils';

const SPRINT_START = "2024-05-07";
const SPRINT_END = "2024-06-10";
const STORY_POINTS_PER_DAY = 4;
const BUG_DEDUCTION_PERCENTAGE = 0.2;

export function calculateDeveloperMetrics(
  jiraIssues: JiraIssue[],
  leaveDaysMap: { [key: string]: { days: number; period: string } }
): DeveloperMetrics[] {
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
    ...Object.keys(leaveDaysMap)
  ]);

  return Array.from(allDevelopers).map(developer => {
    const developerIssues = issuesByDeveloper[developer] || [];
    const leaveInfo = leaveDaysMap[developer] || { days: 0, period: 'No leaves' };
    
    // Calculate metrics
    const totalSprintDays = getWorkingDays(SPRINT_START, SPRINT_END);
    const leaves = leaveInfo.days;
    const availableDays = totalSprintDays - leaves;
    const rawBandwidth = availableDays * STORY_POINTS_PER_DAY;
    const adjustedBandwidth = rawBandwidth * (1 - BUG_DEDUCTION_PERCENTAGE);
    
    // Calculate delivered story points (only "Done" issues within sprint period)
    const deliveredStoryPoints = developerIssues
      .filter(issue => {
        const isWithinSprint = new Date(issue.techCloseDate) >= new Date(SPRINT_START) && 
                              new Date(issue.techCloseDate) <= new Date(SPRINT_END);
        return issue.status === 'Done' && isWithinSprint;
      })
      .reduce((sum, issue) => sum + issue.storyPoints, 0);
    
    // Calculate sprint contribution based on tech start/close dates
    const sprintContribution = developerIssues.length > 0 
      ? Math.max(...developerIssues.map(issue => 
          calculateSprintContribution(issue.techStartDate, issue.techCloseDate)
        ))
      : 0;

    // Calculate effective velocity
    const effectiveVelocity = adjustedBandwidth > 0 ? deliveredStoryPoints / adjustedBandwidth : 0;

    return {
      name: developer,
      leaves,
      availableDays,
      rawBandwidth,
      adjustedBandwidth,
      deliveredStoryPoints,
      effectiveVelocity,
      leaveDetails: leaveInfo.period,
      sprintContribution
    };
  }).sort((a, b) => b.effectiveVelocity - a.effectiveVelocity); // Sort by velocity descending
}

export function formatVelocity(velocity: number): string {
  return `${(velocity * 100).toFixed(0)}%`;
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

export function getContributionBadgeColor(contribution: number): string {
  if (contribution >= 90) return 'bg-green-100 text-green-800';
  if (contribution >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function formatContribution(contribution: number): string {
  return `${contribution.toFixed(0)}%`;
}