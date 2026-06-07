#!/usr/bin/env node

/**
 * Complete workflow: Generate user story + Update AC to Jira
 * Automatically extracts ticket key from JIRA_BASE_URL in .env
 */

import { Anthropic } from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import { JiraClient } from './lib/jira-client.mjs';
import { adfToPlainText, createACTable } from './lib/adf-converter.mjs';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Extract ticket key from URL
function extractTicketKey(url) {
  const match = url.match(/([A-Z]+-\d+)/);
  if (!match) {
    throw new Error(`Cannot extract ticket key from URL: ${url}`);
  }
  return match[1];
}

// Convert ticket to plain text
function ticketToText(ticket) {
  let text = '';
  text += `Ticket: ${ticket.key}\n`;
  text += `Type: ${ticket.fields.issuetype.name}\n`;
  text += `Status: ${ticket.fields.status.name}\n`;
  text += `Summary: ${ticket.fields.summary}\n\n`;
  text += `Description:\n`;

  const description = ticket.fields.description;
  if (description && typeof description === 'object') {
    text += adfToPlainText(description);
  } else if (description) {
    text += description;
  } else {
    text += '(No description)';
  }

  return text;
}

// Analyze style from example ticket
async function analyzeStyle(exampleTicket) {
  console.log('  🧠 Analyzing style with Claude...');

  const exampleText = ticketToText(exampleTicket);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Bạn là chuyên gia phân tích user story. Đọc kỹ ticket example dưới đây và trích xuất:

1. **Structure**: Format, sections, cách tổ chức nội dung
2. **Writing Style**: Tone, độ dài câu, cách diễn đạt
3. **Key Patterns**: Mẫu câu, từ khóa thường dùng
4. **Level of Detail**: Mức độ chi tiết (high-level vs detailed)

Example Ticket:
${exampleText}

Hãy tổng hợp style guide ngắn gọn (300-500 từ) để tôi có thể viết user story mới theo đúng style này.`,
    }],
  });

  return response.content[0].text;
}

// Generate user story
async function generateUserStory(targetTicket, styleGuide) {
  console.log('  ✍️  Generating user story with Claude...');

  const targetText = ticketToText(targetTicket);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: `Bạn là Product Owner chuyên nghiệp. Nhiệm vụ: Viết user story dựa trên ticket description.

**STYLE GUIDE (phải tuân thủ chặt chẽ):**
${styleGuide}

**TARGET TICKET:**
${targetText}

**YÊU CẦU:**
- Viết user story hoàn chỉnh theo đúng style guide
- Dùng format, structure giống example
- Tone và level of detail phải match
- Bổ sung thông tin hợp lý nếu ticket thiếu chi tiết
- Output CHỈ user story, không giải thích

Viết user story:`,
    }],
  });

  return response.content[0].text;
}

// Parse AC from user story
function parseACFromUserStory(userStory) {
  const acList = [];

  // Find Acceptance Criteria section
  const acSectionMatch = userStory.match(/###?\s*\*?\*?Acceptance Criteria\*?\*?:?\s*\n\n([\s\S]+?)(?=\n###|$)/i);
  if (!acSectionMatch) {
    console.warn('⚠️  No Acceptance Criteria section found in user story');
    return acList;
  }

  const acSection = acSectionMatch[1];

  // Extract Figma link from entire user story
  const figmaMatch = userStory.match(/https:\/\/www\.figma\.com[^\s)]+/);
  const figmaLink = figmaMatch ? figmaMatch[0] : '';

  // Parse each AC block
  const acBlocks = acSection.split(/\*\*AC\d+:/);

  for (let i = 1; i < acBlocks.length; i++) {
    const block = acBlocks[i];

    // Extract scenario (first line after "AC1:")
    const scenarioMatch = block.match(/^\s*([^*\n]+)/);
    const scenario = scenarioMatch ? scenarioMatch[1].trim().replace(/\*\*/g, '') : '';

    // Extract GIVEN
    const givenMatch = block.match(/GIVEN\s+(.+?)(?=\n-\s+WHEN|\n\*\*AC|\n###|$)/is);
    const given = givenMatch ? givenMatch[1].trim().replace(/^an?\s+/i, '') : '';

    // Extract WHEN
    const whenMatch = block.match(/WHEN\s+(.+?)(?=\n-\s+THEN|\n\*\*AC|\n###|$)/is);
    const when = whenMatch ? whenMatch[1].trim().replace(/^the\s+/i, '') : '';

    // Extract THEN (may have multiple AND clauses)
    const thenMatch = block.match(/THEN\s+([\s\S]+?)(?=\n\*\*AC|\n###|$)/i);
    let then = '';
    if (thenMatch) {
      // Combine all THEN and AND clauses
      then = thenMatch[1]
        .split(/\n/)
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('**') && !line.startsWith('##'))
        .map(line => line.replace(/^-\s+(AND\s+)?/, ''))
        .join(' AND ')
        .trim();
    }

    if (scenario && given && when && then) {
      acList.push({
        scenario,
        given,
        when,
        then,
        figma: figmaLink
      });
    }
  }

  return acList;
}

// Main workflow
async function main() {
  console.log('\n🚀 Complete Workflow: Generate User Story + Update AC\n');
  console.log('═'.repeat(80));

  // Extract ticket keys from .env
  const targetUrl = process.env.JIRA_BASE_URL;
  const exampleUrl = process.env.USER_STORY_LINK_EXAMPLE;

  if (!targetUrl || !exampleUrl) {
    console.error('\n❌ Missing environment variables:');
    console.error('   - JIRA_BASE_URL (target ticket)');
    console.error('   - USER_STORY_LINK_EXAMPLE (example ticket)\n');
    process.exit(1);
  }

  const targetKey = extractTicketKey(targetUrl);
  const exampleKey = extractTicketKey(exampleUrl);

  console.log(`\n📋 Target Ticket: ${targetKey}`);
  console.log(`📚 Example Ticket: ${exampleKey}\n`);

  const jira = new JiraClient();

  // Step 1: Fetch tickets
  console.log('📥 Step 1: Fetching Jira tickets...');
  console.log(`  Fetching example: ${exampleKey}`);
  const exampleTicket = await jira.getTicket(exampleKey);
  console.log(`  Fetching target: ${targetKey}`);
  const targetTicket = await jira.getTicket(targetKey);
  console.log('  ✅ Tickets fetched\n');

  // Step 2: Analyze style
  console.log('🎨 Step 2: Analyzing user story style...');
  const styleGuide = await analyzeStyle(exampleTicket);
  console.log('  ✅ Style analyzed\n');

  // Step 3: Generate user story
  console.log('✍️  Step 3: Generating user story...');
  const userStory = await generateUserStory(targetTicket, styleGuide);
  console.log('  ✅ User story generated\n');

  // Step 4: Save user story
  const outputFile = `user-story-${targetKey}.md`;
  await fs.writeFile(outputFile, userStory);
  console.log(`💾 Step 4: Saved to ${outputFile}\n`);

  // Step 5: Parse AC from user story
  console.log('📝 Step 5: Parsing Acceptance Criteria...');
  const acList = parseACFromUserStory(userStory);

  if (acList.length === 0) {
    console.error('❌ No AC found in user story. Cannot update Jira.');
    console.error('   Please check user-story file and add AC manually.\n');
    process.exit(1);
  }

  console.log(`  ✅ Found ${acList.length} acceptance criteria:\n`);
  acList.forEach((ac, i) => {
    console.log(`  ${i + 1}. ${ac.scenario}`);
    console.log(`     GIVEN: ${ac.given.substring(0, 60)}...`);
    console.log(`     WHEN: ${ac.when.substring(0, 60)}...`);
    console.log(`     THEN: ${ac.then.substring(0, 60)}...`);
  });
  console.log('');

  // Step 6: Convert to ADF table
  console.log('🔄 Step 6: Converting to Jira table format...');
  const adfTable = createACTable(acList);
  console.log('  ✅ Table created\n');

  // Step 7: Update Jira
  console.log(`📤 Step 7: Updating Acceptance Criteria in ${targetKey}...`);
  await jira.updateTicket(targetKey, {
    customfield_10095: adfTable
  });
  console.log('  ✅ Updated successfully!\n');

  // Summary
  console.log('═'.repeat(80));
  console.log('✨ DONE!\n');
  console.log(`📄 User Story: ${outputFile}`);
  console.log(`🔗 Jira Ticket: ${jira.getBrowseUrl(targetKey)}`);
  console.log(`📊 AC Count: ${acList.length}\n`);
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  console.error('');
  process.exit(1);
});
