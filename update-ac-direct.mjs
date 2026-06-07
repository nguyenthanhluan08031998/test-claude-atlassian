#!/usr/bin/env node

/**
 * Update Acceptance Criteria directly without Claude API
 */

import { JiraClient } from './lib/jira-client.mjs';
import { createACTable } from './lib/adf-converter.mjs';

// AC data for FCM-973
const acData = [
  {
    scenario: "Display Cost Code Rate Details",
    given: "an Approver views the Agreement Approval page",
    when: "the page loads",
    then: "all cost codes with their rate details are displayed in a table format AND each row shows: Cost Code ID, Description, Rate Value, Unit, Effective Date, Status",
    figma: "https://www.figma.com/design/oJx852w119NkvdBmpaaIQv/FCM---Deliver-File-04?node-id=1094-471066&t=JXZXp9Wi9SGGKIeh-4"
  },
  {
    scenario: "Table Functionality",
    given: "the cost code rate table is displayed",
    when: "the Approver interacts with the table",
    then: "the Approver can sort by any column AND can filter by status or rate range AND the table remains responsive and readable",
    figma: ""
  },
  {
    scenario: "Add Comment on Cost Code",
    given: "an Approver is reviewing a specific cost code",
    when: "the Approver clicks \"Add Comment\" button on that row",
    then: "a comment input field appears AND the Approver can enter text AND click \"Save\" to attach the comment to that cost code AND the comment is visible to the Requester",
    figma: ""
  },
  {
    scenario: "Create Task for Correction",
    given: "an Approver identifies an issue with a cost code",
    when: "the Approver clicks \"Create Task\" on that row",
    then: "a task creation modal opens AND the Approver can specify task details (description, priority, due date) AND click \"Create\" to assign the task to the Requester AND the task appears in the Requester's task list linked to the specific cost code",
    figma: ""
  },
  {
    scenario: "Approve/Reject Actions",
    given: "an Approver has reviewed all cost codes",
    when: "the Approver clicks \"Approve\" or \"Reject\" button",
    then: "the action applies to the entire agreement AND if rejected with tasks created, the Requester is notified AND the agreement status updates accordingly",
    figma: ""
  },
  {
    scenario: "Status Indication",
    given: "cost codes have different statuses",
    when: "displayed in the table",
    then: "each row has appropriate color coding (Green for approved, Yellow for pending review, Red for rejected/flagged) AND the color scheme is accessible (meets WCAG contrast standards)",
    figma: ""
  }
];

async function main() {
  const ticketKey = process.argv[2] || 'FCM-973';

  console.log('\n📝 Update Acceptance Criteria in Jira\n');
  console.log('═'.repeat(80));

  // Preview
  console.log(`\n📋 Acceptance Criteria for ${ticketKey}:\n`);
  acData.forEach((ac, i) => {
    console.log(`${i + 1}. ${ac.scenario}`);
    console.log(`   GIVEN: ${ac.given}`);
    console.log(`   WHEN: ${ac.when}`);
    console.log(`   THEN: ${ac.then}`);
    if (ac.figma) {
      console.log(`   FIGMA: ${ac.figma.substring(0, 60)}...`);
    }
    console.log('');
  });

  console.log('═'.repeat(80));

  // Convert to ADF table
  console.log('\n🔄 Converting to Jira table format...');
  const adfTable = createACTable(acData);
  console.log('✅ Table created');

  // Update Jira
  console.log(`\n📤 Updating Acceptance Criteria in ${ticketKey}...`);
  const jira = new JiraClient();
  await jira.updateTicket(ticketKey, {
    customfield_10095: adfTable
  });

  console.log('✅ Acceptance Criteria updated successfully!');
  console.log(`\nView at: ${jira.getBrowseUrl(ticketKey)}`);
  console.log('\n✨ Done!\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
