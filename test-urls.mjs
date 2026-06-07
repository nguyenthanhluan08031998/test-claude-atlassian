#!/usr/bin/env node

/**
 * Test script to verify USER_STORY_LINKS URLs
 */

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function testUrl(url) {
  try {
    console.log(`\nTesting: ${url}`);
    console.log('─'.repeat(80));

    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    const elapsed = Date.now() - startTime;

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Time: ${elapsed}ms`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);

    if (!response.ok) {
      console.log('❌ FAILED - Non-200 status code');
      return false;
    }

    const content = await response.text();
    const contentLength = content.length;

    console.log(`Content Length: ${contentLength} characters`);

    if (contentLength < 100) {
      console.log('⚠️  WARNING - Content is very short (< 100 chars)');
      console.log('First 200 chars:', content.substring(0, 200));
    } else if (contentLength < 500) {
      console.log('⚠️  WARNING - Content seems short (< 500 chars)');
    } else {
      console.log('✅ PASSED - Good content length');
    }

    // Check if looks like user story
    const looksLikeStory =
      content.includes('user story') ||
      content.includes('User Story') ||
      content.includes('acceptance criteria') ||
      content.includes('Acceptance Criteria') ||
      content.includes('GIVEN') ||
      content.includes('story') ||
      content.includes('#');

    if (looksLikeStory) {
      console.log('✅ Content looks like a user story');
    } else {
      console.log('⚠️  Content might not be a user story');
    }

    console.log('\nFirst 300 characters:');
    console.log('─'.repeat(80));
    console.log(content.substring(0, 300).trim());
    console.log('...');

    return true;

  } catch (error) {
    console.log(`❌ FAILED - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n🔍 USER_STORY_LINKS URL Tester\n');
  console.log('═'.repeat(80));

  if (!process.env.USER_STORY_LINKS) {
    console.error('❌ ERROR: USER_STORY_LINKS not found in .env');
    console.log('\nPlease add to .env:');
    console.log('USER_STORY_LINKS=https://your-url-1,https://your-url-2\n');
    process.exit(1);
  }

  const links = process.env.USER_STORY_LINKS
    .split(',')
    .map(l => l.trim())
    .filter(l => l);

  if (links.length === 0) {
    console.error('❌ ERROR: No URLs found in USER_STORY_LINKS');
    process.exit(1);
  }

  console.log(`Found ${links.length} URL(s) to test\n`);

  const results = [];
  for (const link of links) {
    const passed = await testUrl(link);
    results.push({ link, passed });
  }

  // Summary
  console.log('\n\n' + '═'.repeat(80));
  console.log('SUMMARY');
  console.log('═'.repeat(80));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach((r, i) => {
    const status = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${i + 1}. ${status} - ${r.link.substring(0, 70)}...`);
  });

  console.log('');
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('⚠️  Some URLs failed. Please fix them before running the agent.');
    console.log('See URL_GUIDE.md for help on getting valid URLs.\n');
    process.exit(1);
  } else {
    console.log('🎉 All URLs passed! You\'re ready to run the agent.\n');
    console.log('Next step:');
    console.log('  node user-story-agent.mjs PROJ-123\n');
  }
}

main().catch(console.error);
