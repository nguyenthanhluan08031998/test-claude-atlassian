# 📚 Documentation Index

## Quick Navigation

### 🚀 Getting Started (Choose your path)

1. **Super Quick (3 minutes)**
   - Read: [QUICKSTART.md](QUICKSTART.md)
   - Run: `npm install && npm run demo`
   - Perfect for: First-time users, quick test

2. **Detailed Setup (10 minutes)**
   - Read: [SETUP.md](SETUP.md)
   - Configure everything properly
   - Perfect for: Production use

3. **Pre-flight Check**
   - Read: [CHECKLIST.md](CHECKLIST.md)
   - Verify everything works
   - Perfect for: Before first real run

---

## 📖 Main Documentation

### Core Files

| File | Purpose | Read When |
|------|---------|-----------|
| [README.md](README.md) | Overview, features, basic usage | Want to understand what this does |
| [QUICKSTART.md](QUICKSTART.md) | Fastest way to get running | Want to try it ASAP |
| [SETUP.md](SETUP.md) | Detailed setup instructions | Setting up for real use |
| [URL_GUIDE.md](URL_GUIDE.md) | How to get user story URLs | Need to configure USER_STORY_LINKS |
| [CHECKLIST.md](CHECKLIST.md) | Pre-flight verification | Before running agent |

### Deep Dive

| File | Purpose | Read When |
|------|---------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical design, components | Want to understand how it works |
| [WORKFLOW.md](WORKFLOW.md) | Visual flow, data structures | Want to see the process |

---

## 💻 Code Files

| File | Purpose | When to Use |
|------|---------|-------------|
| [user-story-agent.mjs](user-story-agent.mjs) | Main agent script | Production runs with real Jira |
| [demo.mjs](demo.mjs) | Demo script (no Jira) | Testing without Jira access |
| [package.json](package.json) | Dependencies & scripts | npm install, run commands |

---

## 📁 Directories

| Directory | Contents | Purpose |
|-----------|----------|---------|
| [examples/](examples/) | User story samples | Learning material for agent |
| `.env` | API keys, configs | **Keep secret!** Git ignored |

---

## 🎯 Use Cases - Where to Start?

### "I want to see it work NOW"
→ [QUICKSTART.md](QUICKSTART.md) → Run `npm run demo`

### "I need to set this up properly"
→ [SETUP.md](SETUP.md) → Follow step by step

### "Something's not working"
→ [CHECKLIST.md](CHECKLIST.md) → Troubleshooting section

### "I want to understand the internals"
→ [ARCHITECTURE.md](ARCHITECTURE.md) → Components section

### "I want to customize it"
→ [ARCHITECTURE.md](ARCHITECTURE.md) → Extensions section

### "I want to see how data flows"
→ [WORKFLOW.md](WORKFLOW.md) → Visualization diagrams

---

## 🔄 Typical Workflow

```
1. Read QUICKSTART.md (3 min)
         ↓
2. Run demo (1 min)
   npm run demo
         ↓
3. Read SETUP.md (5-10 min)
         ↓
4. Configure .env (5 min)
         ↓
5. Check CHECKLIST.md (2 min)
         ↓
6. Run with real ticket (30 sec)
   node user-story-agent.mjs PROJ-123
         ↓
7. Review & iterate
```

---

## 📊 Documentation Stats

| Metric | Value |
|--------|-------|
| Total docs | 7 files |
| Total words | ~15,000 |
| Est. read time | 45-60 minutes (all) |
| Quick path | 5-10 minutes |

---

## 🎓 Learning Path

### Beginner (Just want it to work)
1. QUICKSTART.md ⭐
2. README.md
3. CHECKLIST.md
**Time:** 15 minutes

### Intermediate (Want to use in production)
1. README.md ⭐
2. SETUP.md ⭐
3. CHECKLIST.md ⭐
4. WORKFLOW.md
**Time:** 30 minutes

### Advanced (Want to customize/extend)
1. All of Intermediate
2. ARCHITECTURE.md ⭐
3. Review source code
**Time:** 60 minutes

---

## 🔍 Finding Information

### "How do I...?"

**...install it?**
→ QUICKSTART.md or SETUP.md

**...get API keys?**
→ SETUP.md → Section 1 & 2

**...run the demo?**
→ QUICKSTART.md → Section 3

**...use it with real Jira?**
→ SETUP.md → Full guide

**...troubleshoot errors?**
→ CHECKLIST.md → Common Issues

**...add more examples?**
→ SETUP.md → Section 3

**...optimize performance?**
→ ARCHITECTURE.md → Performance Optimization

**...batch process tickets?**
→ ARCHITECTURE.md → Batch Processing

**...extend functionality?**
→ ARCHITECTURE.md → Extensions

**...understand token costs?**
→ ARCHITECTURE.md → Token Usage
→ WORKFLOW.md → Token Flow

**...see the data flow?**
→ WORKFLOW.md → Visual diagrams

---

## 📦 File Sizes Reference

```
ARCHITECTURE.md   13 KB  (Technical deep dive)
CHECKLIST.md       9 KB  (Verification guide)
QUICKSTART.md      2 KB  (Fast start)
README.md          6 KB  (Overview)
SETUP.md           9 KB  (Detailed setup)
WORKFLOW.md       17 KB  (Process visualization)
```

**Total documentation:** ~56 KB

---

## 🆘 Emergency Quick Fixes

### Error: "Invalid API key"
```bash
# Fix in .env
ANTHROPIC_API_KEY=sk-ant-xxxxx
```
→ Details: SETUP.md

### Error: "No user stories found"
```bash
# Fix in .env
USER_STORY_FILES=./examples/user-story-1.md,./examples/user-story-2.md
```
→ Details: CHECKLIST.md

### Error: "Jira 401"
```bash
# Test auth
curl -u "email:token" https://company.atlassian.net/rest/api/3/myself
```
→ Details: SETUP.md → Section 2.3

---

## 🎯 Quick Commands

```bash
# Install
npm install

# Demo (no Jira)
npm run demo

# Real run
node user-story-agent.mjs PROJ-123

# Check setup
ls examples/*.md && grep -q ANTHROPIC_API_KEY .env && echo "✅ Ready"
```

---

## 📱 Cheat Sheet

### Environment Variables
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx         # Required
JIRA_BASE_URL=https://x.atlassian.net  # For real Jira
JIRA_EMAIL=you@company.com             # For real Jira
JIRA_API_TOKEN=ATATTxxxxx              # For real Jira
USER_STORY_FILES=./examples/*.md       # Required
```

### Common Paths
```
Config:     .env
Examples:   examples/
Output:     user-story-*.md
Main code:  user-story-agent.mjs
Demo code:  demo.mjs
```

### Key URLs
- Anthropic API Keys: https://console.anthropic.com/settings/keys
- Jira API Tokens: https://id.atlassian.com/manage-profile/security/api-tokens

---

## 🗺️ Documentation Map

```
INDEX.md (You are here)
│
├─ Quick Start
│  ├─ QUICKSTART.md ──→ Demo in 3 minutes
│  └─ README.md ──────→ What & Why
│
├─ Setup & Verify
│  ├─ SETUP.md ───────→ Detailed setup
│  └─ CHECKLIST.md ───→ Verify & troubleshoot
│
└─ Deep Dive
   ├─ ARCHITECTURE.md → How it works
   └─ WORKFLOW.md ────→ Visual flows
```

---

## 💡 Pro Tips

1. **Start with demo** - Always run `npm run demo` first
2. **Check checklist** - Before real runs, verify CHECKLIST.md
3. **3-5 examples** - More examples = better quality
4. **Review output** - Always human-review generated stories
5. **Iterate** - Improve examples based on what works

---

## 📞 Support

1. Check relevant doc file (see index above)
2. Run through CHECKLIST.md
3. Review error messages carefully
4. Check GitHub issues (if available)
5. Ask your team

---

## 🎉 Success Checklist

After setup, you should have:

- [x] All dependencies installed
- [x] `.env` configured with API keys
- [x] 2+ user story examples in `examples/`
- [x] Demo runs successfully
- [x] Generated user story looks good
- [x] Ready for production use

**If all checked → You're ready! 🚀**

---

**Next step:** Choose your path from "Getting Started" above!
