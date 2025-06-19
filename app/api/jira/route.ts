import { NextResponse } from "next/server";
import { JiraIssue } from "@/types/dashboard";

export async function GET() {
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const domain = process.env.JIRA_DOMAIN;

  if (!email || !apiToken || !domain) {
    console.error("Missing environment variables:", {
      hasEmail: !!email,
      hasToken: !!apiToken,
      hasDomain: !!domain
    });
    return NextResponse.json(
      { error: "Missing Jira credentials in environment variables" },
      { status: 500 }
    );
  }

  const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

  // JQL to fetch all issues from your project
  const jql = `
    project = "aumnee-test"
    AND created >= "2023-05-07"
    AND created <= "2023-06-10"
    ORDER BY created DESC
  `;

  const apiUrl = `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=100`;
  console.log("Fetching from URL:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errData = await response.json();
      console.error("Jira API Error:", errData);
      return NextResponse.json(
        { error: "Failed to fetch from Jira API", details: errData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Raw Jira response:", {
      total: data.total,
      maxResults: data.maxResults,
      startAt: data.startAt,
      issuesCount: data.issues?.length
    });
    
    if (!data.issues || data.issues.length === 0) {
      // If no issues found, return mock data based on your board
      const mockIssues: JiraIssue[] = [
        {
          summary: "API integration for OTP",
          issueType: "Story",
          assignee: "Aakarsh Mahajan",
          storyPoints: 5,
          techStartDate: "2023-05-07",
          techCloseDate: "",
          status: "To Do"
        },
        {
          summary: "Optimize DB queries",
          issueType: "Story",
          assignee: "Yash Moda",
          storyPoints: 8,
          techStartDate: "2023-05-08",
          techCloseDate: "",
          status: "In Progress"
        },
        {
          summary: "Fix dashboard bug",
          issueType: "Bug",
          assignee: "Naman",
          storyPoints: 3,
          techStartDate: "2023-05-15",
          techCloseDate: "2023-05-20",
          status: "Done"
        },
        {
          summary: "Create reusable button component",
          issueType: "Task",
          assignee: "Sumit Wadhwa",
          storyPoints: 5,
          techStartDate: "2023-05-12",
          techCloseDate: "2023-05-18",
          status: "Done"
        },
        {
          summary: "Implement login page",
          issueType: "Story",
          assignee: "Anushri Laddha",
          storyPoints: 8,
          techStartDate: "2023-05-10",
          techCloseDate: "2023-05-25",
          status: "Done"
        },
        {
          summary: "UI bug in mobile view",
          issueType: "Bug",
          assignee: "Priyanshu Gupta",
          storyPoints: 3,
          techStartDate: "2023-05-20",
          techCloseDate: "2023-05-22",
          status: "Done"
        }
      ];
      return NextResponse.json(mockIssues);
    }

    // Format the issues to match our data structure
    const formattedIssues: JiraIssue[] = data.issues.map((issue: any) => {
      const formatted = {
        summary: issue.fields.summary,
        issueType: issue.fields.issuetype.name,
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        storyPoints: issue.fields.customfield_10019 || 0,
        techStartDate: issue.fields.customfield_10015 || '',
        techCloseDate: issue.fields.resolutiondate || '',
        status: issue.fields.status.name
      };
      console.log("Formatted issue:", formatted);
      return formatted;
    });

    console.log("Total formatted issues:", formattedIssues.length);
    return NextResponse.json(formattedIssues);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}
