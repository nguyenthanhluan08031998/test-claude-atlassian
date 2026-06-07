# Changes - URL-based Agent

## 🔄 Major Changes

Agent đã được cập nhật để **chỉ dùng URLs** thay vì local files.

### Before (Old)
```env
USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md
```
- Agent đọc files từ disk
- Cần maintain local files

### After (New)
```env
USER_STORY_LINKS=https://docs.google.com/document/d/xxx/export?format=txt,https://raw.githubusercontent.com/...
```
- Agent fetch từ URLs
- Flexible, centralized source
- No local files needed

---

## 📝 What Changed

### 1. Environment Variables
- ❌ Removed: `USER_STORY_FILES`
- ✅ Required: `USER_STORY_LINKS`

### 2. File Structure
- ❌ Removed: `examples/` directory
- ✅ Added: `URL_GUIDE.md` - Hướng dẫn lấy URLs
- ✅ Added: `test-urls.mjs` - Test URLs script

### 3. Code Changes
- `user-story-agent.mjs`: Chỉ fetch từ URLs
- `demo.mjs`: Still uses local files (for demo only)
- Better error messages

### 4. New Scripts
```bash
npm run test-urls  # Test URLs trước khi chạy agent
```

---

## ✅ What You Need to Do

### 1. Update .env
```env
# Old (remove these)
USER_STORY_FILES=./examples/...

# New (add this)
USER_STORY_LINKS=https://your-url-1,https://your-url-2
```

### 2. Get URLs
Xem [URL_GUIDE.md](URL_GUIDE.md) cho hướng dẫn chi tiết:

**Google Docs:**
```
https://docs.google.com/document/d/DOCUMENT_ID/export?format=txt
```

**GitHub:**
```
https://raw.githubusercontent.com/USER/REPO/BRANCH/file.md
```

### 3. Test URLs
```bash
npm run test-urls
```

Nên thấy:
```
✅ PASS - https://...
✅ PASS - https://...
🎉 All URLs passed!
```

### 4. Run Agent
```bash
node user-story-agent.mjs PROJ-123
```

---

## 📚 Updated Documentation

- **[URL_GUIDE.md](URL_GUIDE.md)** - NEW: Chi tiết cách lấy URLs
- **[README.md](README.md)** - Updated: Setup section
- **[QUICKSTART.md](QUICKSTART.md)** - Updated: URL examples
- **[INDEX.md](INDEX.md)** - Updated: File list
- **[.env.example](.env.example)** - Updated: New format

---

## 🎯 Benefits

### URL-based Approach:
✅ **Centralized** - One source of truth  
✅ **Version control** - Use GitHub for examples  
✅ **Collaboration** - Team updates same docs  
✅ **No local sync** - Always latest version  
✅ **Flexible** - Mix sources (Google Docs + GitHub + Wiki)

### Old File-based:
❌ Manual sync needed  
❌ Version conflicts  
❌ Local copies out of date

---

## 🐛 Troubleshooting

### Error: "USER_STORY_LINKS not found"
→ Add to `.env`:
```env
USER_STORY_LINKS=https://...
```

### Error: "Failed to fetch"
→ Run test:
```bash
npm run test-urls
```
→ Check URLs are public
→ See [URL_GUIDE.md](URL_GUIDE.md)

### URLs work but output bad?
→ Check URL returns actual user story content:
```bash
curl "YOUR_URL" | head -50
```

---

## 🚀 Migration Guide

Nếu bạn đang dùng version cũ với local files:

### Step 1: Upload Examples
Upload local examples lên GitHub:
```bash
# Create repo
git init
git add examples/*.md
git commit -m "Add user story examples"
git push origin main
```

### Step 2: Get Raw URLs
```
https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/examples/user-story-1.md
```

### Step 3: Update .env
```env
USER_STORY_LINKS=https://raw.githubusercontent.com/.../user-story-1.md,https://raw.githubusercontent.com/.../user-story-2.md
```

### Step 4: Test
```bash
npm run test-urls
node user-story-agent.mjs TEST-123
```

---

## 💡 Recommended Setup

**Option 1: GitHub (Best)**
1. Create private repo: `company-user-stories`
2. Add `.md` files
3. Use raw URLs

**Option 2: Google Docs**
1. Create docs
2. Share as "Anyone with link"
3. Use export URLs

**Option 3: Confluence**
1. Create public space
2. Use page URLs
3. Or export and host elsewhere

---

## ℹ️ Demo Still Works

`demo.mjs` vẫn dùng local files (nếu có) để test nhanh:
```bash
npm run demo
```

Không cần URLs cho demo.

---

**Questions?** See [URL_GUIDE.md](URL_GUIDE.md) or [INDEX.md](INDEX.md)
