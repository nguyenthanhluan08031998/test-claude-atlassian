# URL Guide - Lấy User Story URLs

Agent cần URLs đến các user story examples. Đây là hướng dẫn lấy URLs cho các platforms phổ biến.

---

## 📝 Google Docs

### Option 1: Export Link (Recommended)

**Cách lấy:**

1. Mở Google Doc
2. Click **File** → **Share** → **Publish to web**
3. Chọn format: **Plain text** hoặc **HTML**
4. Click **Publish**
5. Copy link, format:
   ```
   https://docs.google.com/document/d/DOCUMENT_ID/export?format=txt
   ```

**Ví dụ:**
```env
USER_STORY_LINKS=https://docs.google.com/document/d/1abc123xyz/export?format=txt
```

**Lưu ý:**
- ✅ Không cần authentication
- ✅ Format plain text dễ parse
- ⚠️ Document phải public hoặc "Anyone with the link"

---

### Option 2: Public View Link

1. Click **Share** → Set to "Anyone with the link can view"
2. Copy link:
   ```
   https://docs.google.com/document/d/DOCUMENT_ID/edit
   ```
3. Chuyển sang export format:
   ```
   https://docs.google.com/document/d/DOCUMENT_ID/export?format=txt
   ```

---

## 🌐 Confluence

### Public Page

**Cách lấy:**

1. Mở Confluence page
2. Click **⋯** (More actions) → **Link to this page**
3. Copy URL, format:
   ```
   https://your-company.atlassian.net/wiki/spaces/SPACE/pages/PAGE_ID/Page+Title
   ```

**Ví dụ:**
```env
USER_STORY_LINKS=https://acme.atlassian.net/wiki/spaces/PROD/pages/123456/User+Story+Template
```

**Lưu ý:**
- ⚠️ Page phải public (không cần login)
- ⚠️ Confluence HTML phức tạp, có thể cần parse thêm

---

### Export as Plain Text

Nếu muốn format đơn giản hơn:

1. Mở page
2. Click **⋯** → **Export to Word** hoặc **Export to PDF**
3. Upload lên public hosting (GitHub, S3, etc.)
4. Dùng URL của file đó

---

## 🐙 GitHub / GitLab

### Raw Content URL

**Cách lấy:**

1. Upload user story file lên GitHub repo
2. Mở file trên GitHub
3. Click button **Raw**
4. Copy URL, format:
   ```
   https://raw.githubusercontent.com/USER/REPO/BRANCH/path/to/file.md
   ```

**Ví dụ:**
```env
USER_STORY_LINKS=https://raw.githubusercontent.com/acme/docs/main/user-stories/template-1.md,https://raw.githubusercontent.com/acme/docs/main/user-stories/template-2.md
```

**Lưu ý:**
- ✅ Repo phải public
- ✅ Format markdown, dễ đọc
- ✅ Version control built-in

---

### GitHub Gist

1. Tạo gist tại https://gist.github.com
2. Paste user story content
3. Click **Create public gist**
4. Click **Raw** button
5. Copy URL:
   ```
   https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/COMMIT/filename.md
   ```

---

## 📦 Notion

**Lưu ý:** Notion không có export link trực tiếp.

**Workaround:**

1. Export page as Markdown:
   - Click **⋯** → **Export** → **Markdown & CSV**
2. Upload `.md` file lên GitHub/GitLab
3. Dùng raw GitHub URL

**Hoặc:**

1. Dùng Notion API để fetch content
2. Cần thêm code custom để authenticate

---

## 🌍 Public Wiki / Static Site

Nếu user stories host trên wiki/static site:

```env
USER_STORY_LINKS=https://your-wiki.com/user-story-1.html,https://your-wiki.com/user-story-2.html
```

**Yêu cầu:**
- Public access (không cần auth)
- Content ở dạng text/html

---

## ☁️ Cloud Storage

### AWS S3 / GCS / Azure Blob

1. Upload `.md` files
2. Set public read permission
3. Copy public URL:
   ```
   https://bucket-name.s3.amazonaws.com/user-story-1.md
   ```

**Ví dụ:**
```env
USER_STORY_LINKS=https://acme-docs.s3.amazonaws.com/stories/template-1.md
```

---

## 🔐 Private/Authenticated URLs

### Nếu URLs cần authentication:

Agent hiện tại **không support auth headers**. Bạn cần:

**Option 1: Make public**
- Share document publicly (recommend)

**Option 2: Use proxy**
- Tạo proxy server add auth headers
- Agent gọi proxy, proxy gọi private URL

**Option 3: Modify code**
- Thêm auth vào fetch request trong `user-story-agent.mjs`:

```javascript
const response = await fetch(link, {
  headers: {
    'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
    'User-Agent': 'Mozilla/5.0...',
  },
});
```

---

## ✅ Testing URLs

Test URL trước khi dùng:

```bash
# Test với curl
curl -L "YOUR_URL_HERE"

# Nên thấy content của user story
```

**Good output:**
```
# User Story: Login Feature

## Summary
As a user, I want to...
```

**Bad output:**
```
<html><body>Access Denied</body></html>
```

---

## 📋 Format Checklist

URL tốt cần:

- [ ] Public access (không cần login)
- [ ] Trả về plain text hoặc markdown
- [ ] Content đầy đủ (>500 characters)
- [ ] Stable URL (không đổi khi edit document)
- [ ] Fast response (<5s)

---

## 🎯 Recommended Setup

**Best practice:**

1. **Tạo GitHub repo private/public** cho user story templates
   ```
   acme-user-stories/
   ├── template-feature.md
   ├── template-bug.md
   └── template-technical.md
   ```

2. **Dùng raw GitHub URLs**
   ```env
   USER_STORY_LINKS=https://raw.githubusercontent.com/acme/user-stories/main/template-feature.md,https://raw.githubusercontent.com/acme/user-stories/main/template-bug.md
   ```

3. **Benefits:**
   - ✅ Version control
   - ✅ Easy to update
   - ✅ Review process (PRs)
   - ✅ Free hosting
   - ✅ Stable URLs

---

## 🔧 Example Configurations

### Multiple Google Docs
```env
USER_STORY_LINKS=https://docs.google.com/document/d/abc123/export?format=txt,https://docs.google.com/document/d/xyz789/export?format=txt,https://docs.google.com/document/d/def456/export?format=txt
```

### GitHub Repo
```env
USER_STORY_LINKS=https://raw.githubusercontent.com/acme/docs/main/stories/login.md,https://raw.githubusercontent.com/acme/docs/main/stories/payment.md,https://raw.githubusercontent.com/acme/docs/main/stories/report.md
```

### Mixed Sources
```env
USER_STORY_LINKS=https://docs.google.com/document/d/abc/export?format=txt,https://raw.githubusercontent.com/acme/docs/main/story.md,https://acme.atlassian.net/wiki/spaces/PROD/pages/123/Template
```

---

## ❌ Common Errors

### Error: "Failed to fetch"

**Possible causes:**
- URL requires authentication
- URL is private/internal
- Network/firewall issues
- URL format wrong

**Fix:**
- Make URL public
- Test with curl first
- Check firewall/VPN

---

### Error: "Very short content"

**Possible causes:**
- URL returns error page (HTML)
- Wrong export format
- Empty document

**Fix:**
- Test URL manually
- Verify document has content
- Use correct export format

---

### Error: "HTTP 403 Forbidden"

**Cause:** Document is private

**Fix:**
- Share document publicly
- Or use authenticated proxy

---

## 🆘 Need Help?

1. Test URL với curl:
   ```bash
   curl -L "YOUR_URL" | head -50
   ```

2. Check response headers:
   ```bash
   curl -I "YOUR_URL"
   ```

3. Verify content-type:
   Should be `text/plain`, `text/html`, or `text/markdown`

---

**Ready?** Configure your URLs in `.env`:

```env
USER_STORY_LINKS=url1,url2,url3
```

Then run:
```bash
node user-story-agent.mjs PROJ-123
```
