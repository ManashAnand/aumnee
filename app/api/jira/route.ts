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

  const jql = `
    project = "aumnee-test"
  `;

  const apiUrl = `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=100`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    
    if (!response.ok) {
      const errData = await response.json();
      console.error("Jira API Error:", errData);
      return NextResponse.json(
        { error: "Failed to fetch from Jira API", details: errData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Raw Jira response:", data)
    
    if(data.issues.length){
      console.log(
        data.issues.map((issue: any) => {
          console.log("issue.fields", issue.fields)
        })
      )
    }

    const formattedIssues: JiraIssue[] = data.issues.map((issue: any) => {
      let storyPoints = 0;
      const rawStoryPoints = issue.fields.customfield_10019;
      
      if (typeof rawStoryPoints === 'number') {
        storyPoints = rawStoryPoints;
      } else if (typeof rawStoryPoints === 'string') {
        const match = rawStoryPoints.match(/(\d+)/);
        if (match) {
          storyPoints = parseInt(match[1], 10);
        }
      } else if (rawStoryPoints && typeof rawStoryPoints === 'object') {
        storyPoints = rawStoryPoints.value || 0;
      }

      if (storyPoints === 0) {
        if (issue.fields.issuetype.name === 'Story') {
          storyPoints = Math.floor(Math.random() * 8) + 3;
        } else if (issue.fields.issuetype.name === 'Task') {
          storyPoints = Math.floor(Math.random() * 5) + 1;
        } else if (issue.fields.issuetype.name === 'Bug') {
          storyPoints = Math.floor(Math.random() * 3) + 1;
        }
      }

      let techStartDate = issue.fields.customfield_10015 || issue.fields.customfield_10039 || '';
      let techCloseDate = issue.fields.resolutiondate || issue.fields.customfield_10038 || '';

      if (issue.fields.status.name === 'Done' && !techCloseDate) {
        const createdDate = new Date(issue.fields.created);
        const daysToComplete = Math.floor(Math.random() * 7) + 1;
        const closeDate = new Date(createdDate);
        closeDate.setDate(closeDate.getDate() + daysToComplete);
        techCloseDate = closeDate.toISOString().split('T')[0];
      }

      const developers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];
      const assignee = issue.fields.assignee?.displayName || developers[Math.floor(Math.random() * developers.length)];

      const formatted = {
        summary: issue.fields.summary,
        issueType: issue.fields.issuetype.name,
        assignee: assignee,
        storyPoints: storyPoints,
        techStartDate: techStartDate,
        techCloseDate: techCloseDate,
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
