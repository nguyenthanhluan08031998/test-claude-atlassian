/**
 * Shared Jira API Client
 */

import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

export class JiraClient {
  constructor() {
    // Parse base URL (extract domain if full URL provided)
    let baseUrl = process.env.JIRA_BASE_URL || 'https://oneline.atlassian.net';
    const match = baseUrl.match(/(https?:\/\/[^\/]+)/);
    this.baseUrl = match ? match[1] : baseUrl;

    this.email = process.env.JIRA_EMAIL;
    this.token = process.env.JIRA_API_TOKEN;
    this.auth = Buffer.from(`${this.email}:${this.token}`).toString('base64');
  }

  async getTicket(ticketKey) {
    const response = await fetch(`${this.baseUrl}/rest/api/3/issue/${ticketKey}`, {
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${ticketKey}: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async updateTicket(ticketKey, fields) {
    const response = await fetch(`${this.baseUrl}/rest/api/3/issue/${ticketKey}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(`Failed to update ${ticketKey}: ${JSON.stringify(result)}`);
    }

    return true;
  }

  async createTicket(projectKey, summary, description, issueType = 'Story') {
    const response = await fetch(`${this.baseUrl}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: { key: projectKey },
          summary,
          description,
          issuetype: { name: issueType }
        }
      })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(`Failed to create ticket: ${JSON.stringify(result)}`);
    }

    return await response.json();
  }

  getBrowseUrl(ticketKey) {
    return `${this.baseUrl}/browse/${ticketKey}`;
  }
}
