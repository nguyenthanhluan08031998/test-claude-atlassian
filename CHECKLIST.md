# Pre-flight Checklist ✈️

Trước khi chạy agent, hãy check list này.

---

## 🔧 Setup (one-time)

- [ ] Node.js installed (v16+)
  ```bash
  node --version  # Should show v16.x or higher
  ```

- [ ] Dependencies installed
  ```bash
  npm install
  # Should complete without errors
  ```

- [ ] `.env` file created
  ```bash
  ls -la .env  # Should exist
  ```

- [ ] Anthropic API key set
  ```bash
  grep ANTHROPIC_API_KEY .env
  # Should show: ANTHROPIC_API_KEY=sk-ant-xxxxx
  ```

- [ ] User story examples exist
  ```bash
  ls examples/*.md
  # Should list at least 2 files
  ```

---

## 🎯 Before Each Run

- [ ] Jira credentials configured (if using real Jira)
  ```bash
  grep -E "JIRA_(BASE_URL|EMAIL|API_TOKEN)" .env
  # All 3 should have values
  ```

- [ ] Ticket key is valid format
  ```
  ✅ Good: PROJ-123, ABC-456, TEAM-999
  ❌ Bad: proj-123, PROJ123, PROJ_123
  ```

- [ ] Have permission to access the ticket
  ```bash
  # Test by opening in browser first
  open "https://your-company.atlassian.net/browse/PROJ-123"
  ```

---

## ✅ Quick Tests

### Test 1: API Key Valid

```bash
node -e "
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();
const c = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
c.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 10,
  messages: [{ role: 'user', content: 'hi' }]
}).then(() => console.log('✅ API key valid'))
  .catch(e => console.error('❌ API key invalid:', e.message));
"
```

Expected: `✅ API key valid`

---

### Test 2: Examples Load

```bash
node -e "
const fs = require('fs/promises');
require('dotenv').config();
(async () => {
  const files = process.env.USER_STORY_FILES?.split(',') || [];
  for (const f of files) {
    try {
      await fs.access(f.trim());
      console.log('✅', f.trim());
    } catch {
      console.log('❌', f.trim(), '(not found)');
    }
  }
})();
"
```

Expected: All files show ✅

---

### Test 3: Jira Connection

```bash
# Replace with your values
curl -u "YOUR_EMAIL:YOUR_TOKEN" \
  "https://your-company.atlassian.net/rest/api/3/myself" \
  2>/dev/null | grep -q emailAddress && echo "✅ Jira auth OK" || echo "❌ Jira auth failed"
```

Expected: `✅ Jira auth OK`

---

## 🚀 Run Demo

Before using real Jira, test with demo:

```bash
npm run demo
```

**Expected output:**
```
🎬 DEMO: User Story Agent
═══════════════════════════════════════

📚 Step 1: Loading user story examples
  ✓ Loaded: ./examples/user-story-1.md
  ✓ Loaded: ./examples/user-story-2.md
  ✅ Loaded 2 examples

🎨 Step 2: Analyzing user story style
  🧠 Analyzing style with Claude...
  ✅ Style guide created

🎫 Step 3: Using mock Jira ticket
  Ticket: DEMO-001
  Summary: Thêm tính năng tìm kiếm nâng cao
  ✅ Ticket loaded (mock data)

✍️  Step 4: Generating user story
  ✍️  Generating user story with Claude...
  ✅ User story generated

═══════════════════════════════════════
📄 GENERATED USER STORY
═══════════════════════════════════════

# User Story: ...
[... full story ...]

═══════════════════════════════════════

💾 Saved to: user-story-DEMO-001.md

✨ Demo completed successfully!
```

---

## 🔍 Verify Generated Story

After generation, manually check:

### Structure Check

- [ ] Has Story ID section
- [ ] Has Summary (format: "Là một X, tôi muốn Y để Z")
- [ ] Has Mô tả chi tiết
  - [ ] Bối cảnh (Context)
  - [ ] Giá trị mang lại (Value)
  - [ ] Luồng người dùng (User Flow)
- [ ] Has Acceptance Criteria
  - [ ] Functional Requirements (GIVEN-WHEN-THEN)
  - [ ] Technical Requirements
  - [ ] UI/UX Requirements (if applicable)
- [ ] Has Dependencies
- [ ] Has Out of Scope
- [ ] Has Estimation
- [ ] Has Priority

---

### Content Quality Check

- [ ] Summary matches Jira ticket intent
- [ ] Acceptance criteria are specific and testable
- [ ] No hallucinated information (made-up names, APIs, etc.)
- [ ] Tone is professional and clear
- [ ] No typos or grammar errors
- [ ] Technical details are plausible
- [ ] User flow is logical

---

### Style Consistency Check

- [ ] Format matches examples
- [ ] Section order matches examples
- [ ] Bullet points used appropriately
- [ ] Bold text used for keywords
- [ ] Checkboxes for acceptance criteria
- [ ] Similar sentence length/structure

---

## ⚠️ Common Issues

### Issue: "No user stories found"

**Symptom:**
```
❌ Error: No user stories found
```

**Fix:**
```bash
# Check paths
cat .env | grep USER_STORY_FILES

# Verify files exist
ls -la examples/

# Update .env
echo "USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md" >> .env
```

---

### Issue: "Invalid API key"

**Symptom:**
```
❌ API key invalid: Invalid authentication credentials
```

**Fix:**
1. Get new key: https://console.anthropic.com/settings/keys
2. Update .env:
   ```bash
   # Remove old key
   sed -i '' '/ANTHROPIC_API_KEY/d' .env
   # Add new key
   echo "ANTHROPIC_API_KEY=sk-ant-api03-xxxxx" >> .env
   ```

---

### Issue: "Jira 401 Unauthorized"

**Symptom:**
```
❌ Failed to fetch Jira ticket: 401 Unauthorized
```

**Fix:**
```bash
# Verify credentials
echo "Email: $(grep JIRA_EMAIL .env | cut -d= -f2)"
echo "Token length: $(grep JIRA_API_TOKEN .env | cut -d= -f2 | wc -c)"

# Token should be ~200 characters
# If too short, regenerate at:
# https://id.atlassian.com/manage-profile/security/api-tokens
```

---

### Issue: "Jira 404 Not Found"

**Symptom:**
```
❌ Failed to fetch Jira ticket: 404 Not Found
```

**Fix:**
1. Check ticket key format: `PROJ-123` (uppercase, hyphen)
2. Verify ticket exists (open in browser)
3. Check base URL in .env (no trailing slash)

---

### Issue: Generated story is too generic

**Symptom:**
Story doesn't match your team's style

**Fix:**
1. Add more examples (3-5 is ideal)
2. Ensure examples are consistent
3. Make examples more detailed
4. Try claude-opus-4-8 for better quality:
   ```javascript
   // In user-story-agent.mjs, line ~60
   model: 'claude-opus-4-8',
   ```

---

### Issue: "Rate limit exceeded"

**Symptom:**
```
❌ Rate limit exceeded. Wait and retry.
```

**Fix:**
```bash
# Wait 60 seconds
sleep 60

# Retry
node user-story-agent.mjs PROJ-123
```

For batch processing, add delays:
```javascript
for (const ticket of tickets) {
  await generateStory(ticket);
  await sleep(2000); // 2 second delay
}
```

---

## 📊 Performance Expectations

### Normal Performance

- **Time per ticket:** 20-30 seconds
- **Cost per ticket:** $0.05-0.10
- **Success rate:** >95%

### If you see:

**Time > 60 seconds**
- ❌ Possible network issues
- ❌ Jira/Claude API slowness
- ➡️ Check internet connection
- ➡️ Try again later

**Cost > $0.20**
- ❌ Examples too long (>5000 words each)
- ❌ Max tokens too high
- ➡️ Reduce example size
- ➡️ Check token usage in logs

**Success rate < 80%**
- ❌ API issues
- ❌ Bad examples
- ❌ Jira auth problems
- ➡️ Review error logs
- ➡️ Test with demo first

---

## 🎓 Best Practices

### For Best Results:

1. **Examples:**
   - ✅ 3-5 examples
   - ✅ Consistent format
   - ✅ Different story types (feature, bug, tech)
   - ✅ Complete sections
   - ❌ Not too long (>3000 words)
   - ❌ Not too short (<500 words)

2. **Jira Tickets:**
   - ✅ Clear summary
   - ✅ Detailed description
   - ✅ Context provided
   - ❌ Just a title
   - ❌ Too vague

3. **Review:**
   - ✅ Always review generated story
   - ✅ Edit/refine as needed
   - ✅ Check for hallucinations
   - ❌ Don't copy-paste blindly

4. **Iteration:**
   - ✅ Improve examples based on output
   - ✅ Tweak prompts if needed
   - ✅ Track what works

---

## 📝 Final Checklist

Before shipping to production:

- [ ] Tested with 5+ different tickets
- [ ] Quality is consistently good
- [ ] Team reviewed and approved output
- [ ] Setup documentation is clear
- [ ] Error handling works
- [ ] API keys are secured
- [ ] Cost tracking is in place
- [ ] Have backup examples
- [ ] Monitoring/logging enabled (if applicable)

---

## 🆘 Need Help?

1. Check [SETUP.md](SETUP.md) for detailed setup
2. Check [WORKFLOW.md](WORKFLOW.md) for how it works
3. Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
4. Run `npm run demo` to isolate issues
5. Check logs/errors carefully

---

**Ready to run? Execute:**

```bash
# Demo (no Jira needed)
npm run demo

# Real ticket
node user-story-agent.mjs PROJ-123
```

Good luck! 🚀
