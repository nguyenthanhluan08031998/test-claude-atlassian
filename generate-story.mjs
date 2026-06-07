#!/usr/bin/env node

import { Anthropic } from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { adfToPlainText } from './adf-parser.mjs';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fetch Jira ticket
async function fetchJiraTicket(ticketKey) {
  // Parse base URL (extract domain if full URL provided)
  let baseUrl = process.env.JIRA_BASE_URL || 'https://oneline.atlassian.net';
  const match = baseUrl.match(/(https?:\/\/[^\/]+)/);
  if (match) {
    baseUrl = match[1]; // Extract just the domain
  }

  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  const auth = Buffer.from(`${email}:${token}`).toString('base64');

  console.log(`  Fetching ${ticketKey}...`);
  const response = await fetch(`${baseUrl}/rest/api/3/issue/${ticketKey}`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
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
    // ADF format
    text += adfToPlainText(description);
  } else if (description) {
    text += description;
  } else {
    text += '(No description)';
  }

  return text;
}

// Main
async function main() {
  console.log('\n🤖 User Story Generator\n');
  console.log('═'.repeat(80));

  // Step 1: Fetch example ticket from USER_STORY_LINK_EXAMPLE
  console.log('\n📚 Step 1: Fetching example ticket to learn style...');

  const exampleLink = process.env.USER_STORY_LINK_EXAMPLE;
  if (!exampleLink) {
    console.error('❌ Error: USER_STORY_LINK_EXAMPLE not found in .env');
    console.error('   Add: USER_STORY_LINK_EXAMPLE=https://oneline.atlassian.net/browse/FCM-3715');
    process.exit(1);
  }

  // Extract ticket key from URL or use as-is
  const exampleKeyMatch = exampleLink.match(/([A-Z]+-\d+)/);
  const exampleKey = exampleKeyMatch ? exampleKeyMatch[1] : exampleLink;

  console.log(`  Learning from: ${exampleKey}`);
  const exampleTicket = await fetchJiraTicket(exampleKey);
  const exampleText = ticketToText(exampleTicket);
  console.log('✅ Example loaded\n');

  // Step 2: Fetch target ticket (from argument or default FCM-973)
  const targetKey = process.argv[2] || 'FCM-973';
  console.log(`🎫 Step 2: Fetching target ticket ${targetKey}...`);
  const targetTicket = await fetchJiraTicket(targetKey);
  const targetText = ticketToText(targetTicket);
  console.log('✅ Target loaded\n');

  console.log('Target ticket info:');
  console.log(`  Key: ${targetTicket.key}`);
  console.log(`  Summary: ${targetTicket.fields.summary}`);
  console.log('');

  // Step 3: Analyze style
  console.log('🎨 Step 3: Analyzing writing style from example...');
  const styleResponse = await anthropic.messages.create({
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

  const styleGuide = styleResponse.content[0].text;
  console.log('✅ Style analyzed\n');

  // Step 4: Generate user story
  console.log('✍️  Step 4: Generating user story...');
  const storyResponse = await anthropic.messages.create({
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

  const userStory = storyResponse.content[0].text;
  console.log('✅ User story generated\n');

  // Output
  console.log('═'.repeat(80));
  console.log(`USER STORY for ${targetTicket.key}`);
  console.log('═'.repeat(80));
  console.log('');
  console.log(userStory);
  console.log('');
  console.log('═'.repeat(80));

  // Save
  const outputFile = `user-story-${targetTicket.key}.md`;
  const fs = await import('fs/promises');
  await fs.writeFile(outputFile, userStory);
  console.log(`\n💾 Saved to: ${outputFile}\n`);
}

main().catch(console.error);
