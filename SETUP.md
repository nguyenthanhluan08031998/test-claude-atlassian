# Setup Guide - User Story Agent

## Quick Start (5 phút)

### Bước 1: Clone/Download project

```bash
cd ~/Desktop/study-claude
```

### Bước 2: Install Node.js packages

```bash
npm install
```

### Bước 3: Tạo file .env

```bash
cp .env.example .env
```

Mở `.env` và điền thông tin:

```env
# 1. Lấy Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# 2. Thông tin Jira của bạn
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=youremail@company.com
JIRA_API_TOKEN=your_token_here

# 3. Đường dẫn user story examples
USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md
```

### Bước 4: Test thử

```bash
node user-story-agent.mjs PROJ-123
```

Thay `PROJ-123` bằng Jira ticket key thật của bạn.

---

## Chi tiết từng bước

### 1. Lấy Anthropic API Key

#### Option A: Dùng API key có sẵn
Nếu bạn đã có Anthropic account:

1. Vào https://console.anthropic.com/settings/keys
2. Click **Create Key**
3. Copy key (format: `sk-ant-api03-...`)
4. Paste vào `.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   ```

#### Option B: Tạo account mới (Free tier)
1. Đăng ký tại https://console.anthropic.com/
2. Verify email
3. Lấy $5 free credit
4. Tạo API key như Option A

**Lưu ý:** 
- Free tier đủ để test khoảng 20-30 user stories
- Mỗi user story tiêu tốn ~$0.10-0.20

---

### 2. Cấu hình Jira

#### Bước 2.1: Lấy Jira Base URL

URL Jira của công ty bạn, ví dụ:
- `https://acme-corp.atlassian.net`
- `https://myteam.atlassian.net`

**Cách tìm:**
1. Mở Jira trên browser
2. Copy phần URL từ đầu đến `.net`
3. Paste vào `.env`:
   ```env
   JIRA_BASE_URL=https://your-company.atlassian.net
   ```

#### Bước 2.2: Email đăng nhập Jira

Email bạn dùng để login Jira:

```env
JIRA_EMAIL=yourname@company.com
```

#### Bước 2.3: Tạo Jira API Token

1. Vào https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token**
3. Đặt tên: "User Story Agent"
4. Copy token (format: một chuỗi dài random)
5. Paste vào `.env`:
   ```env
   JIRA_API_TOKEN=ATATTxxxxxxxxxxxxx
   ```

**Lưu ý bảo mật:**
- ⚠️ Không commit token vào Git
- ⚠️ Token có quyền toàn bộ Jira account của bạn
- ✅ File `.env` đã được thêm vào `.gitignore`

---

### 3. Chuẩn bị User Story Examples

Agent cần học style từ ít nhất 2-3 user story examples.

#### Option A: Dùng examples có sẵn (Recommended)

Project đã có 2 examples mẫu:
```
examples/
├── user-story-1.md  (Đăng nhập Google)
├── user-story-2.md  (Xuất báo cáo Excel)
```

Trong `.env`, set:
```env
USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md
```

#### Option B: Thêm user story của công ty bạn

**Bước 1:** Copy user stories thực tế vào `examples/`

```bash
# Tạo file mới
touch examples/user-story-company-1.md
touch examples/user-story-company-2.md
```

**Bước 2:** Paste nội dung user story vào files

**Bước 3:** Update `.env`:
```env
USER_STORY_FILES=./examples/user-story-company-1.md,./examples/user-story-company-2.md,./examples/user-story-1.md
```

#### Option C: Load từ URLs

Nếu user stories của bạn ở Google Docs, Confluence, etc:

```env
USER_STORY_LINKS=https://docs.google.com/document/d/xxxxx/export?format=txt,https://your-wiki.com/user-story-template
```

**Lưu ý:** URLs phải public hoặc có authentication riêng.

---

### 4. Verify Setup

Chạy script test để đảm bảo mọi thứ hoạt động:

```bash
node user-story-agent.mjs TEST-123
```

**Kỳ vọng:**
```
🚀 Starting User Story Agent...

📚 Step 1: Loading user story examples...
✅ Loaded 2 user story examples

🎨 Step 2: Analyzing user story style...
✅ Style guide created

🎫 Step 3: Fetching Jira ticket TEST-123...
```

Nếu có lỗi, xem phần **Troubleshooting** bên dưới.

---

## Troubleshooting

### ❌ Lỗi: "Cannot find module '@anthropic-ai/sdk'"

**Nguyên nhân:** Chưa install dependencies

**Fix:**
```bash
npm install
```

---

### ❌ Lỗi: "Invalid API key"

**Nguyên nhân:** 
- API key sai
- API key hết hạn
- Thiếu `ANTHROPIC_API_KEY` trong `.env`

**Fix:**
1. Kiểm tra file `.env` có đúng format không:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   ```
2. Tạo API key mới tại https://console.anthropic.com/settings/keys
3. Đảm bảo không có dấu space đầu/cuối

---

### ❌ Lỗi: "Failed to fetch Jira ticket: 401 Unauthorized"

**Nguyên nhân:**
- Jira email hoặc API token sai
- Token hết hạn

**Fix:**
1. Verify email chính xác:
   ```bash
   echo $JIRA_EMAIL
   ```
2. Tạo Jira API token mới:
   - Vào https://id.atlassian.com/manage-profile/security/api-tokens
   - Revoke token cũ
   - Tạo token mới
3. Test manual với curl:
   ```bash
   curl -u "your-email@company.com:YOUR_TOKEN" \
     https://your-company.atlassian.net/rest/api/3/myself
   ```

---

### ❌ Lỗi: "Failed to fetch Jira ticket: 404 Not Found"

**Nguyên nhân:**
- Ticket key không tồn tại
- Không có quyền xem ticket
- JIRA_BASE_URL sai

**Fix:**
1. Kiểm tra ticket key đúng format: `PROJ-123` (chữ IN HOA)
2. Thử mở ticket trên browser trước
3. Verify base URL:
   ```env
   JIRA_BASE_URL=https://your-company.atlassian.net
   ```
   (Không có `/` ở cuối)

---

### ❌ Lỗi: "No user stories found"

**Nguyên nhân:**
- File paths sai
- Files không tồn tại

**Fix:**
1. Kiểm tra files có tồn tại:
   ```bash
   ls -la examples/
   ```
2. Verify paths trong `.env`:
   ```env
   USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md
   ```
3. Đường dẫn phải relative từ project root

---

### ❌ Agent tạo user story không theo đúng style

**Nguyên nhân:**
- Examples quá ít (< 2)
- Examples không nhất quán
- Model không đủ mạnh

**Fix:**
1. Thêm nhiều examples (3-5 là tốt):
   ```env
   USER_STORY_FILES=./examples/us-1.md,./examples/us-2.md,./examples/us-3.md
   ```
2. Đảm bảo examples có format giống nhau
3. Nâng cấp model trong code:
   ```javascript
   model: 'claude-opus-4-8',  // Thay vì sonnet
   ```

---

### ❌ Lỗi: "Request timeout"

**Nguyên nhân:**
- Network chậm
- Jira ticket có quá nhiều data
- Server Jira bận

**Fix:**
1. Tăng timeout trong code (dòng ~60):
   ```javascript
   const response = await fetch(url, {
     timeout: 60000,  // Tăng lên 60s
   });
   ```
2. Thử lại sau vài phút
3. Kiểm tra network:
   ```bash
   ping atlassian.net
   ```

---

## Advanced Configuration

### Thay đổi Output Format

Nếu muốn output khác (không phải markdown), edit function `generateUserStory()`:

```javascript
// Thêm vào prompt
Hãy viết user story theo format:
- JSON
- HTML
- Confluence Wiki format
- Jira ticket format
```

### Tự động đẩy lên Confluence

Thêm Confluence API integration sau khi generate:

```javascript
// Sau khi tạo user story
const confluenceResponse = await fetch(
  `${CONFLUENCE_URL}/rest/api/content`,
  {
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
          value: userStory,
          representation: 'storage',
        },
      },
    }),
  }
);
```

### Batch Processing

Tạo file `batch-generate.mjs`:

```javascript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const tickets = ['PROJ-100', 'PROJ-101', 'PROJ-102'];

for (const ticket of tickets) {
  console.log(`Processing ${ticket}...`);
  await execAsync(`node user-story-agent.mjs ${ticket}`);
}
```

Chạy:
```bash
node batch-generate.mjs
```

---

## Best Practices

### 1. User Story Examples Quality

✅ **TỐT:**
- 3-5 examples với format nhất quán
- Mỗi example đầy đủ sections
- Cover nhiều loại stories (feature, bug fix, technical)

❌ **KHÔNG TỐT:**
- Chỉ 1 example
- Examples có format khác nhau hoàn toàn
- Examples quá ngắn hoặc thiếu thông tin

### 2. Jira Ticket Quality

Agent output tốt khi Jira ticket có:
- Summary rõ ràng
- Description chi tiết
- Acceptance criteria (nếu có)
- Context/background

### 3. Prompt Engineering

Nếu muốn customize, edit prompt trong `generateUserStory()`:

```javascript
// Thêm constraints
Hãy viết user story với các yêu cầu:
- Ngắn gọn, dưới 500 từ
- Ưu tiên technical details
- Bỏ qua phần UI/UX nếu không cần thiết
- Viết bằng tiếng Việt/English [chọn 1]
```

---

## Cost Estimation

**Claude API Pricing (2026):**
- Input: ~$3/1M tokens
- Output: ~$15/1M tokens

**Ước tính mỗi user story:**
- Input: ~5,000 tokens (examples + prompt + ticket)
- Output: ~2,000 tokens (user story)
- **Total: ~$0.05/story**

Với $5 free credit → ~100 user stories

---

## Next Steps

Sau khi setup xong:

1. ✅ Test với 1-2 tickets thật
2. ✅ Đánh giá quality output
3. ✅ Tweak examples nếu cần
4. ✅ Share với team
5. ✅ Tích hợp vào workflow (CI/CD, Slack bot, etc.)

---

## Support

- 📖 README: [README.md](README.md)
- 🐛 Issues: Tạo issue trên repo
- 💬 Questions: Hỏi team hoặc PM
