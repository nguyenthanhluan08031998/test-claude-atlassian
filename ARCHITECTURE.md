# Architecture - User Story Agent

## Overview

Agent này sử dụng Claude AI để học style viết user story và tự động tạo user story mới từ Jira tickets.

```
┌─────────────────┐
│  User Stories   │ (examples/*.md)
│    Examples     │
└────────┬────────┘
         │
         │ 1. Load & Read
         ▼
┌─────────────────┐
│     Claude      │
│  Style Analyzer │ (Phase 1)
└────────┬────────┘
         │
         │ 2. Extract patterns
         ▼
┌─────────────────┐
│  Style Guide    │ (in-memory)
│    (Rules)      │
└────────┬────────┘
         │
         │ 3. Use as template
         ▼
┌─────────────────┐      ┌──────────────┐
│   Jira Ticket   │◄─────┤  Jira API    │
│  (Description)  │      └──────────────┘
└────────┬────────┘
         │
         │ 4. Generate
         ▼
┌─────────────────┐
│     Claude      │
│ Story Generator │ (Phase 2)
└────────┬────────┘
         │
         │ 5. Output
         ▼
┌─────────────────┐
│   User Story    │ (user-story-XXX.md)
│   (Markdown)    │
└─────────────────┘
```

---

## Components

### 1. **User Story Loader** (`loadUserStories()`)

**Nhiệm vụ:**
- Đọc user story examples từ files hoặc URLs
- Parse content thành array

**Input:**
- `USER_STORY_FILES`: comma-separated file paths
- `USER_STORY_LINKS`: comma-separated URLs

**Output:**
```javascript
[
  {
    source: './examples/user-story-1.md',
    content: '# User Story: ...'
  },
  ...
]
```

**Error handling:**
- Warn nếu file không tồn tại (nhưng không crash)
- Skip invalid URLs

---

### 2. **Style Analyzer** (`analyzeUserStoryStyle()`)

**Nhiệm vụ:**
- Gửi tất cả examples đến Claude
- Yêu cầu trích xuất patterns và rules

**Claude Prompt:**
```
Bạn là chuyên gia phân tích user story.
Đọc các examples và trích xuất:
1. Structure (sections, format)
2. Writing style (tone, sentence length)
3. Patterns (templates, keywords)
4. Acceptance criteria format
5. Best practices
```

**Model:** `claude-sonnet-4-6`

**Output:** Style guide text (~1000-2000 tokens)

**Example style guide:**
```
## Structure
Mỗi user story gồm các sections:
- Story ID
- Tóm tắt (format: Là một X, tôi muốn Y để Z)
- Mô tả chi tiết
  - Bối cảnh
  - Giá trị mang lại
  - Luồng người dùng
- Acceptance Criteria
  - Functional Requirements (GIVEN-WHEN-THEN)
  - Technical Requirements
  - UI/UX Requirements
- Dependencies
- Out of Scope
- Estimation

## Writing Style
- Tone: Professional, rõ ràng, cụ thể
- Câu ngắn, dễ hiểu
- Dùng bullet points cho lists
- Bold cho keywords quan trọng
...
```

---

### 3. **Jira Client** (`JiraClient` class)

**Nhiệm vụ:**
- Fetch Jira ticket qua REST API v3
- Handle authentication

**Authentication:**
```
Basic Auth = Base64(email:api_token)
```

**API Endpoint:**
```
GET https://your-domain.atlassian.net/rest/api/3/issue/{ticketKey}
```

**Response (relevant fields):**
```json
{
  "key": "PROJ-123",
  "fields": {
    "summary": "...",
    "description": "...",
    "issuetype": { "name": "Story" },
    "priority": { "name": "High" },
    "assignee": { "displayName": "John Doe" }
  }
}
```

**Error handling:**
- 401: Invalid credentials
- 404: Ticket not found
- 500: Server error

---

### 4. **User Story Generator** (`generateUserStory()`)

**Nhiệm vụ:**
- Nhận style guide + Jira ticket
- Gửi đến Claude với prompt chi tiết
- Tạo user story hoàn chỉnh

**Claude Prompt:**
```
Bạn là Product Owner chuyên nghiệp.

[Style Guide]
{styleGuide}

[Jira Ticket Info]
- Key: PROJ-123
- Summary: ...
- Description: ...

Hãy viết user story theo đúng style guide.
Tuân thủ 100% format, tone, patterns.
Output chỉ cần user story, không giải thích.
```

**Model:** `claude-sonnet-4-6`

**Max tokens:** 8192 (đủ cho user story dài ~3000 words)

**Output:** Complete user story markdown

---

## Data Flow

### Phase 1: Learning (One-time per run)

```
Examples (files)
    ↓ read files
Raw text
    ↓ send to Claude
Style Guide (in-memory)
```

**Time:** ~5-10 seconds
**Cost:** ~5K input + 1.5K output tokens = $0.04

---

### Phase 2: Generation (Per ticket)

```
Jira API
    ↓ fetch ticket
Ticket data
    ↓ combine with Style Guide
Claude prompt
    ↓ generate
User Story
    ↓ save
Markdown file
```

**Time:** ~10-15 seconds
**Cost:** ~3K input + 2K output tokens = $0.04

---

**Total per ticket:** ~$0.08, ~20 seconds

---

## Token Usage Breakdown

### Style Analysis (Phase 1)

**Input tokens:**
- User story examples: ~3000 tokens (2 examples × 1500 words)
- System prompt: ~500 tokens
- Instructions: ~200 tokens
- **Total input:** ~3700 tokens

**Output tokens:**
- Style guide: ~1500 tokens

**Cost:**
- Input: 3700 × $3/1M = $0.011
- Output: 1500 × $15/1M = $0.0225
- **Total:** ~$0.034

---

### User Story Generation (Phase 2)

**Input tokens:**
- Style guide: ~1500 tokens
- Jira ticket: ~500 tokens
- System prompt: ~300 tokens
- Instructions: ~200 tokens
- **Total input:** ~2500 tokens

**Output tokens:**
- User story: ~2000 tokens

**Cost:**
- Input: 2500 × $3/1M = $0.0075
- Output: 2000 × $15/1M = $0.03
- **Total:** ~$0.0375

---

**Grand total per ticket:** ~$0.07

With $5 free credit → ~70 user stories

---

## Performance Optimization

### 1. **Caching Style Guide**

Hiện tại: Analyze style mỗi lần chạy

**Optimization:**
```javascript
// Cache style guide to file
const cacheFile = '.cache/style-guide.json';

if (fs.existsSync(cacheFile)) {
  styleGuide = await fs.readFile(cacheFile, 'utf-8');
} else {
  styleGuide = await analyzeUserStoryStyle(stories);
  await fs.writeFile(cacheFile, styleGuide);
}
```

**Benefit:**
- Giảm cost từ $0.07 → $0.04/ticket (40% cheaper)
- Nhanh hơn ~5-10 giây

**Trade-off:**
- Phải invalidate cache khi examples thay đổi

---

### 2. **Batch Processing**

Xử lý nhiều tickets cùng lúc:

```javascript
const tickets = ['PROJ-100', 'PROJ-101', 'PROJ-102'];

// Load style guide once
const styleGuide = await analyzeUserStoryStyle(stories);

// Generate all
for (const ticketKey of tickets) {
  const ticket = await jira.getTicket(ticketKey);
  const story = await generateUserStory(ticket, styleGuide);
  // save...
}
```

**Benefit:**
- Chỉ analyze style 1 lần
- Scale tốt cho nhiều tickets

---

### 3. **Parallel Generation**

Nếu có nhiều tickets, generate song song:

```javascript
const promises = tickets.map(async (key) => {
  const ticket = await jira.getTicket(key);
  return generateUserStory(ticket, styleGuide);
});

const stories = await Promise.all(promises);
```

**Benefit:**
- Nhanh hơn nhiều (parallel API calls)
- Giảm latency từ N×20s → ~20s

**Trade-off:**
- Rate limit từ Claude API (50 requests/minute)
- Cần batch ~10 tickets/lần

---

## Error Handling

### 1. **Jira API Errors**

```javascript
try {
  const ticket = await jiraClient.getTicket(ticketKey);
} catch (error) {
  if (error.message.includes('401')) {
    console.error('Invalid Jira credentials');
  } else if (error.message.includes('404')) {
    console.error('Ticket not found');
  } else {
    console.error('Jira API error:', error);
  }
  process.exit(1);
}
```

---

### 2. **Claude API Errors**

```javascript
try {
  const response = await anthropic.messages.create({...});
} catch (error) {
  if (error.status === 429) {
    console.error('Rate limit exceeded. Wait and retry.');
  } else if (error.status === 401) {
    console.error('Invalid Anthropic API key');
  } else {
    console.error('Claude API error:', error);
  }
  throw error;
}
```

---

### 3. **Retry Logic**

Thêm retry cho network errors:

```javascript
async function fetchWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await sleep(2000 * (i + 1)); // Exponential backoff
    }
  }
}
```

---

## Security Considerations

### 1. **API Keys Storage**

✅ **Đúng:**
- Lưu trong `.env` (git ignored)
- Environment variables
- Secret managers (AWS Secrets Manager, 1Password)

❌ **Sai:**
- Hardcode trong code
- Commit vào Git
- Share qua Slack/Email

---

### 2. **Jira Token Permissions**

Jira API token có full access → cần bảo vệ:

- ✅ Use minimum scope nếu có thể
- ✅ Rotate token định kỳ (3-6 tháng)
- ✅ Revoke ngay nếu leak
- ❌ Không share token

---

### 3. **User Story Content**

User stories có thể chứa thông tin nhạy cảm:

- Product roadmap
- Business logic
- Customer data
- Security vulnerabilities

**Best practices:**
- Không log user story ra public systems
- Sanitize data trước khi log
- Cẩn thận khi share generated files

---

## Extensions

### 1. **Slack Integration**

Post user story vào Slack sau khi generate:

```javascript
// Thêm Slack webhook
const slackWebhook = process.env.SLACK_WEBHOOK_URL;

await fetch(slackWebhook, {
  method: 'POST',
  body: JSON.stringify({
    text: `✅ User story generated for ${ticketKey}`,
    attachments: [{
      text: userStory.substring(0, 500) + '...',
    }],
  }),
});
```

---

### 2. **Confluence Auto-publish**

Tự động tạo Confluence page:

```javascript
const confluenceAuth = Buffer.from(
  `${CONFLUENCE_EMAIL}:${CONFLUENCE_TOKEN}`
).toString('base64');

await fetch(`${CONFLUENCE_URL}/rest/api/content`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${confluenceAuth}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'page',
    title: `User Story: ${ticketKey}`,
    space: { key: 'PRODUCT' },
    body: {
      storage: {
        value: markdownToConfluence(userStory),
        representation: 'storage',
      },
    },
  }),
});
```

---

### 3. **GitHub Actions CI/CD**

Auto-generate khi ticket được tag:

```yaml
name: Generate User Story
on:
  issues:
    types: [labeled]

jobs:
  generate:
    if: github.event.label.name == 'needs-user-story'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: node user-story-agent.mjs ${{ github.event.issue.number }}
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
      - uses: actions/upload-artifact@v3
        with:
          name: user-story
          path: user-story-*.md
```

---

## Testing Strategy

### 1. **Unit Tests**

Test các functions riêng lẻ:

```javascript
// test/loader.test.mjs
import { loadUserStories } from '../user-story-agent.mjs';

describe('loadUserStories', () => {
  it('should load files correctly', async () => {
    process.env.USER_STORY_FILES = './examples/user-story-1.md';
    const stories = await loadUserStories();
    expect(stories).toHaveLength(1);
    expect(stories[0].content).toContain('User Story');
  });
});
```

---

### 2. **Integration Tests**

Test với real API (hoặc mocks):

```javascript
// test/integration.test.mjs
describe('End-to-end', () => {
  it('should generate user story from Jira ticket', async () => {
    const story = await main(['TEST-123']);
    expect(story).toContain('# User Story');
    expect(story).toContain('Acceptance Criteria');
  });
});
```

---

### 3. **Manual QA Checklist**

- [ ] Generated story follows examples' format?
- [ ] All sections present?
- [ ] Acceptance criteria clear?
- [ ] No hallucinated info?
- [ ] Tone matches examples?
- [ ] No sensitive data leaked?

---

## Monitoring & Observability

### Metrics to track:

1. **Performance:**
   - Average generation time
   - Token usage per story
   - API call latencies

2. **Quality:**
   - User satisfaction (thumbs up/down)
   - Manual edit rate
   - Rejection rate

3. **Cost:**
   - Total API cost/month
   - Cost per story
   - Token efficiency

### Logging:

```javascript
const log = {
  timestamp: new Date().toISOString(),
  ticketKey,
  tokensUsed: {
    input: response.usage.input_tokens,
    output: response.usage.output_tokens,
  },
  latency: Date.now() - startTime,
  success: true,
};

await fs.appendFile('logs/generation.jsonl', JSON.stringify(log) + '\n');
```

---

## Future Improvements

1. **Multi-language support**
   - Detect Jira ticket language
   - Generate in same language

2. **Custom templates**
   - Allow users to define their own sections
   - Template marketplace

3. **Iterative refinement**
   - User feedback loop
   - "Regenerate with changes"

4. **Visual editor**
   - Web UI instead of CLI
   - Live preview
   - Drag-drop sections

5. **Team collaboration**
   - Review workflow
   - Comments and suggestions
   - Version history

---

## Conclusion

Agent này là một POC (Proof of Concept) cho việc tự động hóa user story writing.

**Strengths:**
✅ Consistent format
✅ Fast generation
✅ Low cost
✅ Learns from examples

**Limitations:**
❌ Requires good examples
❌ May hallucinate details
❌ Needs human review
❌ Style drift over time

**Recommended usage:**
→ Generate draft → Human review → Refine → Publish
