# User Story Generator for Jira

Tự động tạo User Story và Acceptance Criteria từ Jira tickets sử dụng Claude AI.

## 📋 Features

- ✅ Đọc Jira ticket và học style viết từ ticket mẫu
- ✅ Generate user story với Claude AI
- ✅ Tự động điền Acceptance Criteria vào Jira (format: GIVEN/WHEN/THEN table)
- ✅ Hỗ trợ Atlassian Document Format (ADF)

## 🚀 Quick Start

```bash
# 1. Setup
npm install
cp .env.example .env

# 2. Cấu hình .env
ANTHROPIC_API_KEY=sk-ant-xxx
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-token
USER_STORY_LINK_EXAMPLE=https://your-domain.atlassian.net/browse/EXAMPLE-123

# 3. Chạy
npm run fetch FCM-973              # Xem ticket
npm run generate                   # Generate user story
npm run update-ac                  # Update AC vào Jira
```

## 📂 Cấu trúc

```
.
├── lib/
│   ├── jira-client.mjs           # Jira API client (shared)
│   └── adf-converter.mjs         # ADF parser & converter (shared)
├── fetch-ticket.mjs              # Xem chi tiết ticket
├── generate-story.mjs            # Generate user story
├── update-ac-direct.mjs          # Update AC vào Jira
├── test-urls.mjs                 # Test URLs validity
└── package.json
```

## 🔧 Scripts

| Command | Mô tả |
|---------|-------|
| `npm run fetch [TICKET-KEY]` | Xem chi tiết Jira ticket |
| `npm run generate [TICKET-KEY]` | Generate user story (mặc định: FCM-973) |
| `npm run update-ac [TICKET-KEY]` | Update Acceptance Criteria vào Jira |
| `npm run test-urls` | Kiểm tra URLs trong .env |

## 📝 Workflow

### 1. Generate User Story

```bash
npm run generate FCM-973
```

- Đọc ticket **example** (từ `USER_STORY_LINK_EXAMPLE`)
- Học style viết từ example
- Đọc ticket **target** (FCM-973)
- Generate user story
- Lưu vào `user-story-FCM-973.md`

### 2. Update Acceptance Criteria

```bash
npm run update-ac FCM-973
```

- Đọc user story đã generate
- Extract AC theo format GIVEN/WHEN/THEN
- Convert sang Jira table (5 cột: Scenario | GIVEN | WHEN | THEN | Figma)
- Update vào field `customfield_10095` (Acceptance Criteria)

## 🎯 Example Output

**Jira Acceptance Criteria Table:**

| # | Scenario | GIVEN | WHEN | THEN | Figma |
|---|----------|-------|------|------|-------|
| 1 | Display Cost Code Rate Details | an Approver views the Agreement Approval page | the page loads | all cost codes with rate details displayed... | [link] |
| 2 | Table Functionality | cost code rate table displayed | Approver interacts | can sort/filter... | |
| ... | ... | ... | ... | ... | ... |

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `JIRA_BASE_URL` | Yes | Jira domain (https://xxx.atlassian.net) |
| `JIRA_EMAIL` | Yes | Your Jira email |
| `JIRA_API_TOKEN` | Yes | Jira API token |
| `USER_STORY_LINK_EXAMPLE` | Yes | Example ticket URL để học style |

## 🛠️ Shared Libraries

### `lib/jira-client.mjs`

```javascript
import { JiraClient } from './lib/jira-client.mjs';

const jira = new JiraClient();
const ticket = await jira.getTicket('FCM-973');
await jira.updateTicket('FCM-973', { customfield_10095: adfTable });
```

### `lib/adf-converter.mjs`

```javascript
import { adfToPlainText, markdownToADF, createACTable } from './lib/adf-converter.mjs';

// ADF → Plain text
const text = adfToPlainText(ticket.fields.description);

// Markdown → ADF
const adf = markdownToADF('## Heading\n- Bullet point');

// Create AC table
const table = createACTable([
  { scenario: "Test", given: "...", when: "...", then: "...", figma: "" }
]);
```

## 🐛 Troubleshooting

**Error: API key not found**
```bash
# Kiểm tra .env có ANTHROPIC_API_KEY chưa
cat .env | grep ANTHROPIC_API_KEY
```

**Error: Failed to fetch ticket**
```bash
# Test Jira credentials
npm run fetch FCM-973
```

**Error: Invalid URL**
```bash
# Test URLs
npm run test-urls
```

## 📚 Docs

- [SETUP.md](SETUP.md) - Chi tiết setup
- [WORKFLOW.md](WORKFLOW.md) - Quy trình làm việc

## 🔑 Cấu hình .env

```env
# Anthropic API Key (bắt buộc)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Jira Configuration (bắt buộc)
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_personal_token

# User Story Examples (chọn 1 trong 2)
# Option 1: Local files (khuyên dùng)
USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md

# Option 2: URLs (nếu có public links)
USER_STORY_LINKS=https://docs.google.com/document/d/xxx,https://confluence.com/xxx
```

### 3. Lấy Jira API Token

1. Vào https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token**
3. Copy token và paste vào `.env`

### 4. Chuẩn bị User Story Examples URLs

Agent học style từ URLs của user story examples (không dùng local files).

**Supported sources:**
- Google Docs (export links)
- GitHub/GitLab (raw URLs)
- Confluence (public pages)
- Any public URL returning text/markdown

**Example:**
```env
USER_STORY_LINKS=https://docs.google.com/document/d/xxx/export?format=txt,https://raw.githubusercontent.com/user/repo/main/story.md
```

📖 **Xem chi tiết:** [URL_GUIDE.md](URL_GUIDE.md) - Hướng dẫn lấy URLs cho từng platform

Khuyến nghị: 3-5 examples

## Sử dụng

### Chạy agent

```bash
node user-story-agent.mjs <JIRA_TICKET_KEY>
```

Ví dụ:

```bash
node user-story-agent.mjs PROJ-123
```

### Output

Agent sẽ:
1. Đọc các user story examples
2. Phân tích style
3. Lấy thông tin từ Jira ticket PROJ-123
4. Tạo user story mới
5. Lưu vào file `user-story-PROJ-123.md`

### Kết quả mẫu

```
🚀 Starting User Story Agent...

📚 Step 1: Loading user story examples...
✅ Loaded 2 user story examples

🎨 Step 2: Analyzing user story style...
✅ Style guide created

🎫 Step 3: Fetching Jira ticket PROJ-123...
✅ Ticket fetched: Implement payment gateway

✍️  Step 4: Generating user story...
✅ User story generated

═══════════════════════════════════════
USER STORY
═══════════════════════════════════════
[User story content here...]
═══════════════════════════════════════

💾 Saved to user-story-PROJ-123.md
```

## Cấu trúc Project

```
.
├── user-story-agent.mjs    # Main agent script
├── package.json             # Dependencies
├── .env                     # Environment variables (git ignored)
├── .env.example             # Template
├── examples/                # User story examples
│   ├── user-story-1.md
│   └── user-story-2.md
├── README.md                # This file
└── user-story-*.md          # Generated outputs
```

## Workflow Chi Tiết

### Phase 1: Load Examples
- Đọc tất cả user story files từ `USER_STORY_FILES`
- Hoặc fetch từ URLs trong `USER_STORY_LINKS`
- Lưu vào array để phân tích

### Phase 2: Analyze Style
- Gửi tất cả examples đến Claude
- Yêu cầu trích xuất:
  - Structure (sections, format)
  - Writing style (tone, sentence length)
  - Patterns (templates, keywords)
  - Acceptance Criteria format
  - Best practices
- Nhận về style guide chi tiết

### Phase 3: Fetch Jira Ticket
- Call Jira REST API v3
- Lấy các field:
  - Summary
  - Description
  - Type
  - Priority
  - Assignee
- Authenticate bằng Basic Auth (email + API token)

### Phase 4: Generate User Story
- Gửi cho Claude:
  - Style guide từ phase 2
  - Jira ticket info từ phase 3
- Claude tạo user story mới theo style
- Lưu vào file markdown

## Tuỳ chỉnh

### Thêm User Story Examples

Chỉ cần thêm file vào `examples/` và update `.env`:

```env
USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md,./examples/user-story-3.md
```

### Thay đổi Model

Trong file `user-story-agent.mjs`, tìm dòng:

```javascript
model: 'claude-sonnet-4-6',
```

Có thể đổi thành:
- `claude-opus-4-8` - Chất lượng cao nhất, chậm hơn
- `claude-sonnet-4-6` - Cân bằng (khuyến nghị)
- `claude-haiku-4-5-20251001` - Nhanh, rẻ hơn

### Thêm Custom Logic

Edit function `generateUserStory()` để thêm:
- Custom prompts
- Additional context
- Validation rules
- Output format khác

## Troubleshooting

### Lỗi: "Failed to fetch Jira ticket"

- Kiểm tra `JIRA_BASE_URL` đúng format: `https://your-domain.atlassian.net`
- Verify `JIRA_EMAIL` và `JIRA_API_TOKEN`
- Thử access ticket trên web browser trước

### Lỗi: "No user stories found"

- Đảm bảo files trong `USER_STORY_FILES` tồn tại
- Check đường dẫn relative từ thư mục gốc project
- Ví dụ: `./examples/user-story-1.md` chứ không phải `/examples/...`

### Agent tạo user story không đúng style

- Thêm nhiều examples hơn (3-5 là tốt nhất)
- Đảm bảo examples có format nhất quán
- Thử model `claude-opus-4-8` để tăng quality

### Lỗi API Key

```
Error: Invalid API key
```

- Kiểm tra `ANTHROPIC_API_KEY` trong `.env`
- Lấy API key mới tại: https://console.anthropic.com/settings/keys

## Ví dụ User Story Format

Xem các file trong `examples/` để hiểu format mẫu:

- [user-story-1.md](examples/user-story-1.md) - Feature story
- [user-story-2.md](examples/user-story-2.md) - Report/Export story

## Advanced: Tích hợp CI/CD

Có thể chạy agent trong GitHub Actions khi Jira ticket được tạo:

```yaml
name: Auto Generate User Story
on:
  issue_comment:
    types: [created]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node user-story-agent.mjs ${{ github.event.issue.key }}
      - uses: actions/upload-artifact@v3
        with:
          name: user-story
          path: user-story-*.md
```

## License

MIT

## Support

Có câu hỏi? Tạo issue hoặc liên hệ team.
