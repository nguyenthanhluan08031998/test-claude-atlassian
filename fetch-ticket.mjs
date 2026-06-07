#!/usr/bin/env node

/**
 * Fetch and display Jira ticket details
 */

import { JiraClient } from './lib/jira-client.mjs';
import { adfToPlainText } from './lib/adf-converter.mjs';

async function main() {
  const ticketKey = process.argv[2] || 'FCM-973';

  try {
    const jira = new JiraClient();
    const ticket = await jira.getTicket(ticketKey);

    console.log('Key:', ticket.key);
    console.log('Type:', ticket.fields.issuetype.name);
    console.log('Status:', ticket.fields.status.name);
    console.log('Summary:', ticket.fields.summary);
    console.log('\nDescription:');

    const description = ticket.fields.description;
    if (description && typeof description === 'object') {
      console.log(adfToPlainText(description));
    } else if (description) {
      console.log(description);
    } else {
      console.log('(No description)');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
