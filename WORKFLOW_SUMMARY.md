# 🔄 Workflow Summary - Chi tiết các bước thực hiện

## 📖 Command 1: `npm run fetch FCM-973`

**Mục đích:** Xem chi tiết Jira ticket

### Các bước thực hiện:

```
1. Đọc config từ .env
   ├─ JIRA_BASE_URL
   ├─ JIRA_EMAIL
   └─ JIRA_API_TOKEN

2. Khởi tạo JiraClient
   └─ Parse base URL (extract domain)
   └─ Tạo Basic Auth header (base64 encode)

3. Call Jira REST API
   └─ GET /rest/api/3/issue/FCM-973

4. Parse response
   ├─ ticket.key (FCM-973)
   ├─ ticket.fields.issuetype.name (Story)
   ├─ ticket.fields.status.name (IN REFINEMENT)
   ├─ ticket.fields.summary
   └─ ticket.fields.description (ADF format)

5. Convert ADF → Plain Text
   └─ Sử dụng lib/adf-converter.mjs
   └─ Parse doc → heading → paragraph → text
   └─ Handle bold, lists, links...

6. Display kết quả
   └─ Print ra terminal
```

**Input:** Ticket key (FCM-973)  
**Output:** Ticket details (console)

---

## ✍️ Command 2: `npm run generate`

**Mục đích:** Generate user story từ Jira ticket

### Các bước thực hiện:

```
┌─────────────────────────────────────────────────────┐
│ STEP 1: Fetch Example Ticket để học style          │
└─────────────────────────────────────────────────────┘

1. Đọc USER_STORY_LINK_EXAMPLE từ .env
   └─ Example: https://oneline.atlassian.net/browse/FCM-3715

2. Extract ticket key từ URL
   └─ Regex: /([A-Z]+-\d+)/
   └─ Result: FCM-3715

3. Fetch ticket FCM-3715 từ Jira API
   └─ GET /rest/api/3/issue/FCM-3715

4. Convert ticket to plain text
   ├─ Key: FCM-3715
   ├─ Type: Story
   ├─ Status: Done
   ├─ Summary: ...
   └─ Description: (ADF → plain text)

┌─────────────────────────────────────────────────────┐
│ STEP 2: Fetch Target Ticket (cần viết story)       │
└─────────────────────────────────────────────────────┘

5. Fetch ticket FCM-973 từ Jira API
   └─ GET /rest/api/3/issue/FCM-973

6. Convert ticket to plain text
   ├─ Key: FCM-973
   ├─ Type: Story
   ├─ Status: IN REFINEMENT
   ├─ Summary: As an FCM Approver, I want to view...
   └─ Description: (ADF → plain text)

┌─────────────────────────────────────────────────────┐
│ STEP 3: Analyze Style với Claude AI                │
└─────────────────────────────────────────────────────┘

7. Gọi Claude API (Sonnet 4.6)
   └─ Model: claude-sonnet-4-6
   └─ Max tokens: 4096

8. Prompt cho Claude:
   "Bạn là chuyên gia phân tích user story.
    Đọc ticket example FCM-3715 và trích xuất:
    - Structure (format, sections)
    - Writing Style (tone, length)
    - Key Patterns (từ khóa, mẫu câu)
    - Level of Detail"

9. Claude phân tích và trả về Style Guide
   └─ Output: Style guide (300-500 từ)

┌─────────────────────────────────────────────────────┐
│ STEP 4: Generate User Story với Claude AI          │
└─────────────────────────────────────────────────────┘

10. Gọi Claude API lần 2 (Sonnet 4.6)
    └─ Model: claude-sonnet-4-6
    └─ Max tokens: 8192

11. Prompt cho Claude:
    "Bạn là Product Owner.
     STYLE GUIDE: [style từ step 3]
     TARGET TICKET: [FCM-973 info]
     
     Viết user story theo đúng style đã học.
     Phải có:
     - Summary
     - Purpose & Context
     - Solution Proposal
     - Acceptance Criteria (AC1, AC2, AC3...)
     - In Scope / Out of Scope
     - Technical Considerations
     - Figma link"

12. Claude generate user story
    └─ Output: Complete user story (markdown)

┌─────────────────────────────────────────────────────┐
│ STEP 5: Save Output                                │
└─────────────────────────────────────────────────────┘

13. Lưu user story vào file
    └─ File: user-story-FCM-973.md
    └─ Format: Markdown

14. Display kết quả
    └─ Print ra terminal
    └─ Show file path
```

**Input:**
- Example ticket key (từ .env: `USER_STORY_LINK_EXAMPLE`)
- Target ticket key (từ argument: FCM-973)
- Claude API key

**Output:**
- File: `user-story-FCM-973.md`

**API Calls:**
- Jira API: 2 calls (example + target)
- Claude API: 2 calls (analyze style + generate story)

---

## 📝 Command 3: `npm run update-ac`

**Mục đích:** Update Acceptance Criteria vào Jira

### Các bước thực hiện:

```
┌─────────────────────────────────────────────────────┐
│ STEP 1: Đọc User Story File                        │
└─────────────────────────────────────────────────────┘

1. Đọc file user-story-FCM-973.md
   └─ File được tạo bởi `npm run generate`
   └─ Chứa toàn bộ user story + AC

2. Parse nội dung markdown
   └─ Tìm section "### **Acceptance Criteria:**"
   └─ Extract tất cả AC blocks:
       **AC1: Display Cost Code Rate Details**
       - GIVEN an Approver views the Agreement Approval page
       - WHEN the page loads
       - THEN all cost codes with rate details...
       
       **AC2: Table Functionality**
       - GIVEN the cost code rate table is displayed
       - WHEN the Approver interacts with the table
       - THEN the Approver can sort by any column...
       
       [... AC3, AC4, AC5, AC6 ...]

3. Extract Figma link từ user story
   └─ Regex search: https://www.figma.com/...
   └─ Dùng chung cho tất cả AC

4. Parse mỗi AC thành structure:
   ├─ scenario: Extract từ "AC1: [Scenario Name]"
   ├─ given: Text sau "GIVEN"
   ├─ when: Text sau "WHEN"
   ├─ then: Text sau "THEN" (có thể nhiều dòng với "AND")
   └─ figma: Figma link (nếu có)

QUAN TRỌNG: AC được generate từ TICKET CONTENT
└─ Không hardcode
└─ Dựa vào business requirements thực tế trong ticket
└─ Claude AI đọc ticket FCM-973 và viết AC phù hợp

┌─────────────────────────────────────────────────────┐
│ STEP 2: Convert AC → Jira ADF Table                │
└─────────────────────────────────────────────────────┘

3. Tạo table structure (ADF format)
   └─ Table with 5 columns:
       | Scenario | GIVEN | WHEN | THEN | Figma |

4. Create table header row
   ├─ type: 'tableRow'
   └─ 5 tableHeader cells:
       - colwidth: [347, 347, 347, 508, 186]
       - background: '#f0f1f2' (gray header)
       - text: bold (marks: [{ type: 'strong' }])

5. Create data rows (6 rows)
   └─ Loop through acData array
   └─ Mỗi AC → 1 tableRow
   └─ 5 tableCell cells:
       ├─ Scenario cell
       ├─ GIVEN cell
       ├─ WHEN cell
       ├─ THEN cell
       └─ Figma cell (link nếu có)

6. Wrap table in ADF document
   └─ {
       type: 'doc',
       version: 1,
       content: [{ type: 'table', ... }]
     }

┌─────────────────────────────────────────────────────┐
│ STEP 3: Update Jira Ticket                         │
└─────────────────────────────────────────────────────┘

7. Khởi tạo JiraClient
   └─ Parse JIRA_BASE_URL
   └─ Setup Basic Auth

8. Call Jira REST API
   └─ PUT /rest/api/3/issue/FCM-973
   └─ Body: {
       fields: {
         customfield_10095: [ADF table object]
       }
     }

9. Jira cập nhật field "Acceptance Criteria"
   └─ Field ID: customfield_10095
   └─ Hiển thị table trong Jira UI

┌─────────────────────────────────────────────────────┐
│ STEP 4: Display Result                             │
└─────────────────────────────────────────────────────┘

10. Show success message
    └─ Print 6 AC đã update
    └─ Show Jira URL: https://oneline.atlassian.net/browse/FCM-973
```

**Input:**
- Ticket key (FCM-973)
- File: user-story-FCM-973.md (chứa AC đã generate)

**Output:**
- Jira ticket field "Acceptance Criteria" được update

**API Calls:**
- Jira API: 1 call (PUT update ticket)

**Lưu ý:**
- AC được đọc từ user story file, KHÔNG hardcode
- Số lượng AC tùy thuộc vào ticket content (có thể 3, 5, 6, 10 AC...)
- Claude AI viết AC dựa trên business requirements trong ticket

---

## 🧪 Command 4: `npm run test-urls`

**Mục đích:** Test URLs trong .env có valid không

### Các bước thực hiện:

```
1. Đọc USER_STORY_LINKS từ .env
   └─ Split by comma
   └─ Trim whitespace

2. Loop qua từng URL
   ├─ Fetch URL với node-fetch
   ├─ Set User-Agent header
   ├─ Measure response time
   └─ Check:
       - Status code (200 OK?)
       - Content length (>100 chars?)
       - Content type
       - Có chứa "user story" keywords?

3. Display results
   ├─ ✅ PASS - URL valid
   └─ ❌ FAIL - URL invalid

4. Summary report
   └─ Total / Passed / Failed
```

**Input:** URLs từ .env  
**Output:** Validation report

---

## 🎯 Complete Workflow Example

### Scenario: Viết user story cho ticket FCM-973

```bash
# Step 1: Xem ticket hiện tại
npm run fetch FCM-973
# → Hiển thị: Summary, Description, Status

# Step 2: Generate user story
npm run generate
# → Học style từ FCM-3715
# → Generate story cho FCM-973
# → Save: user-story-FCM-973.md

# Step 3: Review file (manual)
cat user-story-FCM-973.md
# → Đọc, chỉnh sửa nếu cần

# Step 4: Update AC vào Jira
npm run update-ac
# → Đọc user-story-FCM-973.md
# → Extract AC từ file (GIVEN/WHEN/THEN)
# → Convert sang Jira table format
# → Update vào Acceptance Criteria field
# → Done!
```

---

## 📊 Data Flow Diagram

```
┌──────────┐
│   .env   │ (Config)
└────┬─────┘
     │
     ├─────────────────────────────────────────┐
     │                                         │
     ▼                                         ▼
┌─────────────┐                         ┌─────────────┐
│ Jira API    │◄────────────────────────┤  Scripts    │
│             │                         │             │
│ - FCM-3715  │ (Example ticket)        │ fetch       │
│ - FCM-973   │ (Target ticket)         │ generate    │
│             │                         │ update-ac   │
└─────────────┘                         └──────┬──────┘
                                               │
                                               ▼
┌──────────────────────────────────────┐  ┌─────────────┐
│ Claude API (Anthropic)               │◄─┤  Libs       │
│                                      │  │             │
│ 1. Analyze style (FCM-3715)         │  │ jira-client │
│ 2. Generate story (FCM-973)         │  │ adf-convert │
│                                      │  └─────────────┘
└────────────────┬─────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ user-story-      │
        │ FCM-973.md       │
        └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Jira Ticket     │
        │ AC field updated│
        └─────────────────┘
```

---

## 🔑 Key Takeaways

### `npm run generate` - Phức tạp nhất

- **4 API calls** (2 Jira + 2 Claude)
- **2 AI prompts** (analyze + generate)
- **~30-60 seconds** execution time
- **Cost:** ~$0.05 per run (Claude API)

### `npm run update-ac` - Nhanh nhất

- **1 API call** (Jira PUT)
- **No AI** (đọc AC từ file markdown)
- **~2 seconds** execution time
- **Cost:** Free

### Shared Logic

- **JiraClient** được dùng bởi: fetch, generate, update-ac
- **ADF Converter** được dùng bởi: fetch, generate, update-ac
- **No code duplication** 🎉

---

## 📝 Notes

1. **`generate`** cần ANTHROPIC_API_KEY trong .env
2. **`update-ac`** không cần Claude API, đọc từ file user story
3. **AC được tự động viết** bởi Claude dựa trên ticket content trong step `generate`
4. **Jira field ID** `customfield_10095` là "Acceptance Criteria" field
5. **Quan trọng:** AC không hardcode, mà được generate từ business requirements thực tế
