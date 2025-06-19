import { NextResponse } from 'next/server';
import { JiraIssue } from '@/types/dashboard';

// Mock Jira data for sprint 07/05 to 10/06
const mockJiraIssues: JiraIssue[] = [
  {
    summary: "Implement user authentication system",
    issueType: "Story",
    assignee: "manash",
    storyPoints: 8,
    startDate: "2024-07-08",
    closeDate: "2024-07-15",
    status: "Done"
  },
  {
    summary: "Fix login validation bug",
    issueType: "Bug",
    assignee: "manash",
    storyPoints: 3,
    startDate: "2024-07-16",
    closeDate: "2024-07-18",
    status: "Done"
  },
  {
    summary: "Create dashboard wireframes",
    issueType: "Task",
    assignee: "aakarsh",
    storyPoints: 5,
    startDate: "2024-07-08",
    closeDate: "2024-07-12",
    status: "Done"
  },
  {
    summary: "Implement search functionality",
    issueType: "Story",
    assignee: "aakarsh",
    storyPoints: 13,
    startDate: "2024-07-15",
    closeDate: "2024-07-25",
    status: "Done"
  },
  {
    summary: "Setup CI/CD pipeline",
    issueType: "Task",
    assignee: "priya",
    storyPoints: 8,
    startDate: "2024-07-10",
    closeDate: "2024-07-20",
    status: "Done"
  },
  {
    summary: "Database optimization",
    issueType: "Story",
    assignee: "priya",
    storyPoints: 5,
    startDate: "2024-07-22",
    closeDate: "2024-07-28",
    status: "Done"
  },
  {
    summary: "Fix memory leak in API",
    issueType: "Bug",
    assignee: "raj",
    storyPoints: 5,
    startDate: "2024-07-12",
    closeDate: "2024-07-16",
    status: "Done"
  },
  {
    summary: "Mobile responsive design",
    issueType: "Story",
    assignee: "raj",
    storyPoints: 8,
    startDate: "2024-07-18",
    closeDate: "2024-07-26",
    status: "Done"
  },
  {
    summary: "API rate limiting",
    issueType: "Story",
    assignee: "sarah",
    storyPoints: 5,
    startDate: "2024-07-08",
    closeDate: "2024-07-14",
    status: "Done"
  },
  {
    summary: "Update documentation",
    issueType: "Task",
    assignee: "sarah",
    storyPoints: 3,
    startDate: "2024-07-24",
    closeDate: "2024-07-26",
    status: "Done"
  },
  {
    summary: "Performance monitoring setup",
    issueType: "Story",
    assignee: "manash",
    storyPoints: 8,
    startDate: "2024-07-28",
    closeDate: "2024-08-05",
    status: "In Progress"
  },
  {
    summary: "Fix CSS styling issues",
    issueType: "Bug",
    assignee: "aakarsh",
    storyPoints: 2,
    startDate: "2024-07-28",
    closeDate: "",
    status: "To Do"
  }
];

export async function GET() {
  return NextResponse.json(mockJiraIssues);
}