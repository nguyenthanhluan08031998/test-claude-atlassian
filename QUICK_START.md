# 🚀 Quick Start Guide

## ✨ One Command Workflow

```bash
# Chỉ cần 1 lệnh để làm TẤT CẢ:
npm start
```

**Lệnh này sẽ:**
1. ✅ Đọc ticket từ `JIRA_BASE_URL` trong .env
2. ✅ Học style từ ticket example
3. ✅ Generate user story
4. ✅ Parse Acceptance Criteria
5. ✅ Update AC vào Jira

---

## 📝 Setup (Chỉ làm 1 lần)

### 1. Install dependencies
```bash
npm install
```

### 2. Tạo file .env
```bash
cp .env.example .env
```

### 3. Điền thông tin vào .env

```bash
# Claude API Key
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Target ticket (ticket bạn muốn viết user story)
JIRA_BASE_URL=https://oneline.atlassian.net/browse/FCM-973

# Jira credentials
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-token

# Example ticket (để học style)
USER_STORY_LINK_EXAMPLE=https://oneline.atlassian.net/browse/FCM-3715
```

**⚠️ QUAN TRỌNG:**
- `JIRA_BASE_URL` = ticket BẠN MUỐN VIẾT (target)
- `USER_STORY_LINK_EXAMPLE` = ticket MẪU để học style (example)

---

## 🎯 Sử dụng

### Cách 1: Làm tất cả một lúc (Khuyên dùng)

```bash
npm start
```

**Output:**
- File: `user-story-FCM-973.md`
- Jira: AC field được update tự động

### Cách 2: Làm từng bước

```bash
# Bước 1: Xem ticket hiện tại
npm run fetch

# Bước 2: Generate user story only
npm run generate

# Bước 3: Update AC vào Jira
npm run update-ac
```

---

## 🔄 Đổi Ticket

**Muốn viết user story cho ticket khác?**

Chỉ cần **sửa 1 dòng** trong .env:

```bash
# Thay đổi từ FCM-973...
JIRA_BASE_URL=https://oneline.atlassian.net/browse/FCM-973

# ...sang ticket mới
JIRA_BASE_URL=https://oneline.atlassian.net/browse/FCM-1234
```

Rồi chạy lại:
```bash
npm start
```

**Xong!** Script tự động:
- Extract ticket key (FCM-1234)
- Đọc ticket content
- Generate user story phù hợp
- Update AC

---

## 📊 Ví dụ Output

### Console Output:
```
🚀 Complete Workflow: Generate User Story + Update AC

📋 Target Ticket: FCM-973
📚 Example Ticket: FCM-3715

📥 Step 1: Fetching Jira tickets...
  ✅ Tickets fetched

🎨 Step 2: Analyzing user story style...
  ✅ Style analyzed

✍️  Step 3: Generating user story...
  ✅ User story generated

💾 Step 4: Saved to user-story-FCM-973.md

📝 Step 5: Parsing Acceptance Criteria...
  ✅ Found 6 acceptance criteria:
  1. Display Cost Code Rate Details
  2. Table Functionality
  3. Add Comment on Cost Code
  4. Create Task for Correction
  5. Approve/Reject Actions
  6. Status Indication

🔄 Step 6: Converting to Jira table format...
  ✅ Table created

📤 Step 7: Updating Acceptance Criteria in FCM-973...
  ✅ Updated successfully!

✨ DONE!

📄 User Story: user-story-FCM-973.md
🔗 Jira Ticket: https://oneline.atlassian.net/browse/FCM-973
📊 AC Count: 6
```

### File Output: `user-story-FCM-973.md`

```markdown
# User Story: FCM-973 - Display Cost Code Rate Details

## Summary
As an FCM Approver, I want to view specific cost code rates...

### Acceptance Criteria:

**AC1: Display Cost Code Rate Details**
- GIVEN an Approver views the Agreement Approval page
- WHEN the page loads
- THEN all cost codes with rate details are displayed...

[... AC2, AC3, AC4, AC5, AC6 ...]
```

### Jira Output:

Field **"Acceptance Criteria"** được update với table:

| # | Scenario | GIVEN | WHEN | THEN | Figma |
|---|----------|-------|------|------|-------|
| 1 | Display Cost Code... | an Approver views... | the page loads | all cost codes... | [link] |
| ... | ... | ... | ... | ... | ... |

---

## ⚡ Tips

### 1. Test trước khi chạy
```bash
# Xem ticket hiện tại
npm run fetch

# Kiểm tra có đúng ticket không?
```

### 2. Review trước khi update
```bash
# Chỉ generate, chưa update Jira
npm run generate

# Đọc file user-story-XXX.md
# Chỉnh sửa nếu cần

# Sau đó mới update
npm run update-ac
```

### 3. Nhiều tickets
```bash
# Ticket 1
vim .env  # Sửa JIRA_BASE_URL=...FCM-100
npm start

# Ticket 2
vim .env  # Sửa JIRA_BASE_URL=...FCM-200
npm start

# Ticket 3
vim .env  # Sửa JIRA_BASE_URL=...FCM-300
npm start
```

---

## 🐛 Troubleshooting

### Error: "Cannot extract ticket key"
```bash
# Kiểm tra JIRA_BASE_URL format
# Đúng: https://xxx.atlassian.net/browse/FCM-973
# Sai: https://xxx.atlassian.net
```

### Error: "No AC found in user story"
```bash
# User story không có section Acceptance Criteria
# Kiểm tra file user-story-XXX.md
# Thêm AC manually hoặc chạy lại generate
```

### Error: "API key not found"
```bash
# Thiếu ANTHROPIC_API_KEY trong .env
vim .env
# Thêm: ANTHROPIC_API_KEY=sk-ant-xxx
```

---

## 📚 More Docs

- [WORKFLOW_SUMMARY.md](WORKFLOW_SUMMARY.md) - Chi tiết từng bước
- [README.md](README.md) - Full documentation
- [.env.example](.env.example) - Config template

---

## 💰 Cost

- **Jira API:** Free
- **Claude API:** ~$0.05 per ticket
  - 2 API calls (analyze + generate)
  - ~8K tokens input + 3K tokens output

---

## 🎉 That's it!

Đơn giản nhất:
1. Sửa `JIRA_BASE_URL` trong .env
2. Chạy `npm start`
3. Done!
