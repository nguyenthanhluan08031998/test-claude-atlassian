# Workflow Visualization

## High-level Flow

```
┌──────────────┐
│    START     │
└──────┬───────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌─────────────────┐                  ┌──────────────┐
│  Load Examples  │                  │  Setup Jira  │
│  (Local files)  │                  │    Client    │
└────────┬────────┘                  └──────┬───────┘
         │                                  │
         │ Files read                       │ Auth ready
         ▼                                  │
┌─────────────────┐                         │
│   Parse & Store │                         │
│   (In memory)   │                         │
└────────┬────────┘                         │
         │                                  │
         │ Examples ready                   │
         ▼                                  │
┌─────────────────────────────────┐         │
│      PHASE 1: LEARNING          │         │
│                                 │         │
│  ┌──────────────────────────┐  │         │
│  │  Send examples to Claude │  │         │
│  └────────────┬─────────────┘  │         │
│               │                 │         │
│               ▼                 │         │
│  ┌──────────────────────────┐  │         │
│  │  Claude analyzes style   │  │         │
│  │  - Structure             │  │         │
│  │  - Patterns              │  │         │
│  │  - Writing rules         │  │         │
│  └────────────┬─────────────┘  │         │
│               │                 │         │
│               ▼                 │         │
│  ┌──────────────────────────┐  │         │
│  │  Style Guide generated   │  │         │
│  └────────────┬─────────────┘  │         │
│               │                 │         │
└───────────────┼─────────────────┘         │
                │                           │
                │ Style ready               │
                │                           │
                └───────────┬───────────────┘
                            │
                            ▼
                ┌────────────────────────┐
                │  PHASE 2: GENERATION   │
                │                        │
                │  ┌──────────────────┐ │
                │  │ Fetch Jira ticket│ │◄──── Jira API
                │  └────────┬─────────┘ │
                │           │            │
                │           ▼            │
                │  ┌──────────────────┐ │
                │  │ Combine:         │ │
                │  │ - Style Guide    │ │
                │  │ - Ticket data    │ │
                │  └────────┬─────────┘ │
                │           │            │
                │           ▼            │
                │  ┌──────────────────┐ │
                │  │ Send to Claude   │ │
                │  └────────┬─────────┘ │
                │           │            │
                │           ▼            │
                │  ┌──────────────────┐ │
                │  │ Claude generates │ │
                │  │   User Story     │ │
                │  └────────┬─────────┘ │
                │           │            │
                └───────────┼────────────┘
                            │
                            ▼
                ┌─────────────────────┐
                │  Save to Markdown   │
                │  user-story-XXX.md  │
                └──────────┬──────────┘
                           │
                           ▼
                    ┌──────────┐
                    │   DONE   │
                    └──────────┘
```

---

## Detailed Phase 1: Learning

```
Examples (files)
    │
    ├─ user-story-1.md (1500 words)
    ├─ user-story-2.md (1800 words)
    └─ user-story-3.md (1200 words)
    │
    ▼
Read & Concatenate
    │
    ▼
┌────────────────────────────────────────┐
│         Claude Prompt                  │
│                                        │
│  "Analyze these examples and extract: │
│   - Structure                          │
│   - Writing style                      │
│   - Patterns                           │
│   - Acceptance criteria format         │
│   - Best practices"                    │
└────────────────┬───────────────────────┘
                 │
                 ▼
         [Claude API Call]
         Model: sonnet-4-6
         Max tokens: 4096
         Temperature: 0.7
                 │
                 ▼
┌────────────────────────────────────────┐
│           Style Guide                  │
│                                        │
│  ## Structure                          │
│  - Section 1: Story ID                 │
│  - Section 2: Summary                  │
│  - Section 3: Details                  │
│    - Context                           │
│    - Value                             │
│    - User flow                         │
│  - Section 4: Acceptance Criteria      │
│    - Functional (GIVEN-WHEN-THEN)      │
│    - Technical                         │
│    - UI/UX                             │
│                                        │
│  ## Writing Style                      │
│  - Tone: Professional, clear           │
│  - Sentence: Short, concise            │
│  - Format: Bullet points               │
│                                        │
│  ## Patterns                           │
│  - "Là một X, tôi muốn Y để Z"        │
│  - Bold keywords                       │
│  - Checkbox for AC                     │
│                                        │
│  ... (full guide ~1500 tokens)         │
└────────────────────────────────────────┘
```

**Output:** Style guide stored in memory (~1500 tokens)

**Time:** 5-10 seconds  
**Cost:** ~$0.034

---

## Detailed Phase 2: Generation

```
Jira Ticket (PROJ-123)
    │
    ├─ Summary: "Add advanced search"
    ├─ Description: "Users need filters..."
    ├─ Type: Story
    ├─ Priority: High
    └─ Assignee: John
    │
    ▼
Fetch via Jira API
    │
    ▼
┌─────────────────────────────────────────┐
│         Combine Inputs                  │
│                                         │
│  Style Guide (from Phase 1)             │
│  +                                      │
│  Jira Ticket Data                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Claude Prompt                   │
│                                         │
│  "You are a Product Owner.              │
│                                         │
│  [Style Guide]                          │
│  {full style guide text}                │
│                                         │
│  [Jira Ticket]                          │
│  Key: PROJ-123                          │
│  Summary: Add advanced search           │
│  Description: ...                       │
│                                         │
│  Write a complete user story following  │
│  the style guide exactly."              │
└────────────────┬────────────────────────┘
                 │
                 ▼
         [Claude API Call]
         Model: sonnet-4-6
         Max tokens: 8192
         Temperature: 0.7
                 │
                 ▼
┌─────────────────────────────────────────┐
│        Generated User Story             │
│                                         │
│  # User Story: Advanced Search          │
│                                         │
│  ## Story ID                            │
│  US-123                                 │
│                                         │
│  ## Tóm tắt                             │
│  Là một người dùng, tôi muốn tìm kiếm   │
│  sản phẩm với filters để dễ dàng tìm    │
│  được sản phẩm phù hợp.                 │
│                                         │
│  ## Mô tả chi tiết                      │
│  ### Bối cảnh                           │
│  Hiện tại search chỉ theo tên...        │
│                                         │
│  ### Giá trị mang lại                   │
│  - Giảm thời gian tìm kiếm...           │
│                                         │
│  ### Luồng người dùng                   │
│  1. User vào trang search               │
│  2. Nhập keywords...                    │
│                                         │
│  ## Acceptance Criteria                 │
│  **AC1: Filter by price**               │
│  - GIVEN user on search page            │
│  - WHEN enters min/max price            │
│  - THEN shows filtered results          │
│                                         │
│  ... (full story ~2000 tokens)          │
└─────────────────────────────────────────┘
```

**Output:** Complete user story markdown

**Time:** 10-15 seconds  
**Cost:** ~$0.0375

---

## Token Flow

### Input Tokens (what we send to Claude)

**Phase 1:**
```
System prompt:        500 tokens
Instructions:         200 tokens
Example 1:          1500 tokens
Example 2:          1800 tokens
Example 3:          1200 tokens
────────────────────────────────
Total input:        5200 tokens × $3/1M = $0.0156
```

**Phase 2:**
```
System prompt:        300 tokens
Instructions:         200 tokens
Style guide:         1500 tokens
Jira ticket:          500 tokens
────────────────────────────────
Total input:        2500 tokens × $3/1M = $0.0075
```

---

### Output Tokens (what Claude generates)

**Phase 1:**
```
Style guide:        1500 tokens × $15/1M = $0.0225
```

**Phase 2:**
```
User story:         2000 tokens × $15/1M = $0.0300
```

---

**Total cost per ticket:**
```
Phase 1: $0.0156 + $0.0225 = $0.0381
Phase 2: $0.0075 + $0.0300 = $0.0375
───────────────────────────────────────
Grand total:                   $0.0756 ≈ $0.08
```

---

## Time Flow

```
Start
│
├─ Load examples         (1s)
│
├─ Claude Phase 1        (8s)
│  ├─ API call           (1s)
│  ├─ Processing         (6s)
│  └─ Response           (1s)
│
├─ Fetch Jira            (2s)
│  ├─ API call           (1s)
│  └─ Parse              (1s)
│
├─ Claude Phase 2        (12s)
│  ├─ API call           (1s)
│  ├─ Generation         (10s)
│  └─ Response           (1s)
│
└─ Save file             (0.1s)

Total: ~23 seconds
```

---

## Data Structure

### In-memory Style Guide

```javascript
{
  structure: [
    { section: 'Story ID', required: true },
    { section: 'Summary', format: 'Là một X, tôi muốn Y để Z' },
    { section: 'Details', subsections: ['Context', 'Value', 'User Flow'] },
    { section: 'Acceptance Criteria', format: 'GIVEN-WHEN-THEN' },
    // ...
  ],
  style: {
    tone: 'Professional',
    sentenceLength: 'short',
    format: 'bullet-points',
    keywords: ['bold'],
  },
  patterns: [
    'Là một {role}, tôi muốn {action} để {value}',
    'GIVEN {context} WHEN {action} THEN {result}',
    // ...
  ],
}
```

_(Lưu ý: Thực tế là plain text, không phải JSON. Đây chỉ là conceptual representation)_

---

## Error Handling Flow

```
Try Execute
    │
    ├─ Load examples
    │  ├─ File not found? → Warn, continue
    │  └─ Parse error?    → Skip file
    │
    ├─ Claude Phase 1
    │  ├─ API error?      → Retry (3x)
    │  ├─ Timeout?        → Abort
    │  └─ Rate limit?     → Wait & retry
    │
    ├─ Fetch Jira
    │  ├─ 401 Unauthorized? → Show auth error
    │  ├─ 404 Not found?    → Show ticket error
    │  └─ Network error?    → Retry (3x)
    │
    ├─ Claude Phase 2
    │  ├─ API error?      → Retry (3x)
    │  ├─ Invalid output? → Regenerate
    │  └─ Rate limit?     → Wait & retry
    │
    └─ Save file
       ├─ Permission error? → Show disk error
       └─ Success          → Done
```

---

## Concurrency Model (Batch Mode)

Khi xử lý nhiều tickets:

```
Tickets: [PROJ-100, PROJ-101, PROJ-102, ...]
    │
    ▼
Load Examples (once)
    │
    ▼
Analyze Style (once)
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
  Ticket1  Ticket2  Ticket3  Ticket4
    │        │        │        │
    ├─ Fetch │        │        │
    ├─ Gen   ├─ Fetch │        │
    ├─ Save  ├─ Gen   ├─ Fetch │
    │        ├─ Save  ├─ Gen   ├─ Fetch
    │        │        ├─ Save  ├─ Gen
    │        │        │        ├─ Save
    │        │        │        │
    └────────┴────────┴────────┘
                  │
                  ▼
            All Complete
```

**Parallelism:** Limited by Claude rate limit (50 req/min)

**Optimal batch size:** 10 tickets at a time

---

## Caching Strategy (Future)

```
┌────────────────┐
│  Examples Hash │ (e.g., MD5 of file contents)
└───────┬────────┘
        │
        ▼
   Cache exists?
        │
   ┌────┴────┐
   │         │
  Yes        No
   │         │
   ▼         ▼
 Load    Analyze
 Cache   & Cache
   │         │
   └────┬────┘
        │
        ▼
   Style Guide
```

**Invalidation:** When examples change (detect by hash)

**Storage:** `.cache/style-guide-{hash}.json`

**Benefit:** Skip Phase 1, save ~$0.04 per ticket

---

## API Rate Limits

### Claude API (Anthropic)

- **Free tier:** 50 requests/minute
- **Paid tier:** 1000 requests/minute

**Our usage:**
- 2 requests per ticket (Phase 1 + Phase 2)
- Max throughput: 25 tickets/minute (free) or 500 tickets/minute (paid)

### Jira API (Atlassian)

- **Rate limit:** Varies by plan, typically 100-300 req/min
- **Our usage:** 1 request per ticket

**Bottleneck:** Claude API (slower)

---

## Summary

```
Input:
  - User story examples (2-5 files)
  - Jira ticket key (e.g., PROJ-123)

Process:
  - Learn style from examples
  - Fetch ticket data
  - Generate user story

Output:
  - Markdown file (user-story-PROJ-123.md)

Performance:
  - Time: ~23 seconds
  - Cost: ~$0.08
  - Success rate: ~95%

Quality:
  - Format consistency: High
  - Content accuracy: Medium-High (needs review)
  - Tone match: High
```

---

## Next: See ARCHITECTURE.md for technical details
