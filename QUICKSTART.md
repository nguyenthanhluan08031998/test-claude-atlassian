# Quick Start - 3 phút

## 1. Install

```bash
npm install
```

## 2. Setup API Keys

```bash
cp .env.example .env
```

Mở `.env` và điền:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-xxxxx

# For real Jira (optional for demo)
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_token

# User story examples (URLs only)
USER_STORY_LINKS=https://docs.google.com/document/d/xxx/export?format=txt,https://raw.githubusercontent.com/...
```

## 3. Run Demo (không cần Jira)

```bash
npm run demo
```

Output: Tạo user story từ mock data, không cần connect Jira thật.

## 4. Run với Jira thật

```bash
node user-story-agent.mjs PROJ-123
```

Thay `PROJ-123` bằng ticket key của bạn.

---

## Lấy API Keys

### Anthropic API Key
1. Vào https://console.anthropic.com/settings/keys
2. Create Key
3. Copy vào `.env`

### Jira API Token
1. Vào https://id.atlassian.com/manage-profile/security/api-tokens
2. Create API token
3. Copy vào `.env`

---

## Kết quả

Agent sẽ tạo file: `user-story-PROJ-123.md`

Format theo đúng style của examples bạn cung cấp.

---

## Troubleshooting

**Lỗi "Invalid API key"**
→ Kiểm tra `ANTHROPIC_API_KEY` trong `.env`

**Lỗi "No user stories found"**
→ Đảm bảo `USER_STORY_LINKS` có URLs hợp lệ:
```env
USER_STORY_LINKS=https://docs.google.com/document/d/xxx/export?format=txt,...
```
→ Xem [URL_GUIDE.md](URL_GUIDE.md) để biết cách lấy URLs

**Lỗi Jira 401**
→ Kiểm tra email và token, thử curl:
```bash
curl -u "email:token" https://your-domain.atlassian.net/rest/api/3/myself
```

---

## Docs

- 📖 [README.md](README.md) - Chi tiết đầy đủ
- 🔧 [SETUP.md](SETUP.md) - Hướng dẫn setup chi tiết
- 💡 [Examples](examples/) - User story mẫu

---

**Ready to go? Run:**

```bash
npm run demo
```
