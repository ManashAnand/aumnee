import { NextResponse } from "next/server";

export async function GET() {
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const domain = process.env.JIRA_DOMAIN;

  const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

  const jql = `
    project = AT AND status = Done
  `;

  try {
    const response = await fetch(
      `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Jira API Error:", errData);
      return NextResponse.json(errData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    // @ts-ignore
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
