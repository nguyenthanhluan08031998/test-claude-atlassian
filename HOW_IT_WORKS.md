# 🔍 How It Works - Workflow Chi Tiết

## 📌 Điểm Quan Trọng

### ✅ Script ĐỌC từ JIRA_BASE_URL

```bash
# File: .env
JIRA_BASE_URL=https://oneline.atlassian.net/browse/FCM-973
USER_STORY_LINK_EXAMPLE=https://oneline.atlassian.net/browse/FCM-3715
```

**Không hardcode ticket key!**
- Bạn đổi URL → Script tự động đổi ticket
- Linh hoạt, không cần sửa code

---

## 🔄 Complete Workflow: `npm start`

### STEP 1: Extract Ticket Keys từ .env

```javascript
// Đọc từ .env
JIRA_BASE_URL = "https://oneline.atlassian.net/browse/FCM-973"
USER_STORY_LINK_EXAMPLE = "https://oneline.atlassian.net/browse/FCM-3715"

// Regex extract
targetKey = "FCM-973"       // ← Ticket cần viết user story
exampleKey = "FCM-3715"     // ← Ticket dùng để học style
```

**✅ Dynamic:** Đổi URL trong .env → Tự động đổi ticket

---

### STEP 2: Fetch Tickets từ Jira API

```javascript
// Call Jira REST API
const exampleTicket = await jira.getTicket("FCM-3715")
const targetTicket = await jira.getTicket("FCM-973")

// Example ticket (FCM-3715)
{
  key: "FCM-3715",
  fields: {
    summary: "Example story...",
    description: { type: "doc", content: [...] },  // ADF format
    status: { name: "Done" },
    ...
  }
}

// Target ticket (FCM-973)
{
  key: "FCM-973",
  fields: {
    summary: "As an FCM Approver, I want to view...",
    description: { 
      // UAT pain points:
      // 1. Changed cost codes not visible
      // 2. Rate field not visible
      // 3. Approval/rejection flow manual
      // 4. Cannot see what changed...
    },
    status: { name: "IN REFINEMENT" },
    ...
  }
}
```

**✅ Đọc nội dung thực tế:** Business requirements từ ticket description

---

### STEP 3: Analyze Style với Claude AI

```javascript
// Gọi Claude API #1
const styleGuide = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  messages: [{
    role: "user",
    content: `
      Đọc ticket FCM-3715 và trích xuất:
      - Structure (format, sections)
      - Writing Style (tone, length)
      - Key Patterns
      - Level of Detail
      
      Ticket Content:
      ${exampleTicketContent}
    `
  }]
})

// Claude phân tích và trả về style guide
styleGuide = `
  Structure: 
  - Summary section with "As a [role], I want..."
  - Purpose & Context explaining pain points
  - Solution Proposal with numbered sub-sections
  - Acceptance Criteria với GIVEN/WHEN/THEN format
  - In Scope / Out of Scope clearly separated
  - Technical Considerations
  - Figma link at end
  
  Writing Style:
  - Professional, direct tone
  - Bullet points for clarity
  - Bold headings for sections
  - Technical terms explained
  
  ...
`
```

**✅ Học từ example:** Hiểu cách viết user story của team

---

### STEP 4: Generate User Story với Claude AI

```javascript
// Gọi Claude API #2
const userStory = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  messages: [{
    role: "user",
    content: `
      Bạn là Product Owner.
      
      STYLE GUIDE (học từ FCM-3715):
      ${styleGuide}
      
      TARGET TICKET (FCM-973):
      Summary: As an FCM Approver, I want to view cost code rates...
      Description:
        - Pain point 1: Changed cost codes not visible
        - Pain point 2: Rate field not visible
        - Pain point 3: Manual approval flow
        - Pain point 4: Cannot see changes
      
      Viết user story theo đúng style, bao gồm:
      - Summary
      - Purpose & Context (giải thích pain points)
      - Solution Proposal (display rate details, add comments, etc.)
      - Acceptance Criteria (AC1: Display details, AC2: Table functions, ...)
      - In Scope / Out of Scope
      - Technical Considerations
    `
  }]
})

// Claude generate dựa trên BUSINESS REQUIREMENTS thực tế
userStory = `
# User Story: FCM-973 - Display Cost Code Rate Details

## Summary
As an FCM Approver, I want to view specific cost code rates...

### Purpose:
- Address UAT pain points where approvers cannot see rate details
- Enable informed decisions with all info in single view
- Streamline approval workflow

### Solution Proposal:
1. Display Rate Details per Cost Code
   - Cost Code ID, Description, Rate Value, Unit, Effective Date, Status
2. Approver Actions
   - Add comments
   - Create tasks
3. Display Logic
   - Table with color coding (Green/Yellow/Red)
   - Sorting & filtering

### Acceptance Criteria:

**AC1: Display Cost Code Rate Details**
- GIVEN an Approver views the Agreement Approval page
- WHEN the page loads
- THEN all cost codes with rate details are displayed in table
- AND each row shows: Cost Code ID, Description, Rate Value, Unit, Effective Date, Status

**AC2: Table Functionality**
- GIVEN the cost code rate table is displayed
- WHEN the Approver interacts with the table
- THEN can sort by any column
- AND can filter by status or rate range
- AND table remains responsive

**AC3: Add Comment on Cost Code**
[...]

**AC4: Create Task for Correction**
[...]

**AC5: Approve/Reject Actions**
[...]

**AC6: Status Indication**
[...]

### In Scope:
- Display rate details in main page
- Comment functionality
- Task creation
- Table with sorting/filtering

### Out of Scope:
- Change history log
- Conversation feature

### Figma:
https://www.figma.com/design/oJx852w119NkvdBmpaaIQv/...
`
```

**✅ AC được viết dựa trên:**
1. Business requirements trong ticket FCM-973
2. Pain points của user (UAT feedback)
3. Solution proposal (display rate details, comments, tasks...)
4. Style format từ FCM-3715

**❌ KHÔNG hardcode AC!**

---

### STEP 5: Save User Story to File

```javascript
const outputFile = `user-story-${targetKey}.md`  // user-story-FCM-973.md
await fs.writeFile(outputFile, userStory)
```

**✅ Dynamic filename:** Tự động dùng ticket key từ .env

---

### STEP 6: Parse AC từ User Story

```javascript
// Đọc lại file vừa save
const userStory = await fs.readFile('user-story-FCM-973.md', 'utf-8')

// Tìm section Acceptance Criteria
const acSection = userStory.match(/### Acceptance Criteria:([\s\S]+?)(?=###|$)/)

// Parse từng AC block
const acList = []

// AC1: Display Cost Code Rate Details
// - GIVEN an Approver views...
// - WHEN the page loads
// - THEN all cost codes...
// - AND each row shows...

→ Parse thành:
{
  scenario: "Display Cost Code Rate Details",
  given: "an Approver views the Agreement Approval page",
  when: "the page loads",
  then: "all cost codes with rate details are displayed in table AND each row shows: Cost Code ID, Description, Rate Value, Unit, Effective Date, Status",
  figma: "https://www.figma.com/..."
}

// Lặp lại cho AC2, AC3, AC4, AC5, AC6...
acList = [ac1, ac2, ac3, ac4, ac5, ac6]  // 6 AC objects
```

**✅ Parse từ nội dung:** Không hardcode

---

### STEP 7: Convert AC → Jira ADF Table

```javascript
// Tạo table structure
const adfTable = {
  type: "doc",
  version: 1,
  content: [{
    type: "table",
    content: [
      // Header row
      {
        type: "tableRow",
        content: [
          { type: "tableHeader", content: "Scenario" },
          { type: "tableHeader", content: "GIVEN" },
          { type: "tableHeader", content: "WHEN" },
          { type: "tableHeader", content: "THEN" },
          { type: "tableHeader", content: "Figma" }
        ]
      },
      // Data row 1 (AC1)
      {
        type: "tableRow",
        content: [
          { type: "tableCell", content: "Display Cost Code Rate Details" },
          { type: "tableCell", content: "an Approver views the Agreement Approval page" },
          { type: "tableCell", content: "the page loads" },
          { type: "tableCell", content: "all cost codes with rate details..." },
          { type: "tableCell", content: "https://www.figma.com/..." }
        ]
      },
      // Data row 2 (AC2)
      {...},
      // Data row 3 (AC3)
      {...},
      // ... AC4, AC5, AC6
    ]
  }]
}
```

**✅ ADF format:** Jira hiểu được

---

### STEP 8: Update Jira Ticket

```javascript
// Call Jira REST API
await jira.updateTicket("FCM-973", {
  customfield_10095: adfTable  // Acceptance Criteria field
})

// Jira nhận ADF table → Render thành bảng trong UI
```

**✅ Kết quả trong Jira:**

Field **"Acceptance Criteria"** hiển thị table:

| # | Scenario | GIVEN | WHEN | THEN | Figma |
|---|----------|-------|------|------|-------|
| 1 | Display Cost Code Rate Details | an Approver views the Agreement Approval page | the page loads | all cost codes with their rate details are displayed in a table format AND each row shows: Cost Code ID, Description, Rate Value, Unit, Effective Date, Status | [Figma link] |
| 2 | Table Functionality | the cost code rate table is displayed | the Approver interacts with the table | the Approver can sort by any column AND can filter by status or rate range AND the table remains responsive and readable | |
| 3 | Add Comment on Cost Code | an Approver is reviewing a specific cost code | the Approver clicks "Add Comment" button on that row | a comment input field appears AND the Approver can enter text AND click "Save" to attach the comment to that cost code AND the comment is visible to the Requester | |
| 4 | Create Task for Correction | an Approver identifies an issue with a cost code | the Approver clicks "Create Task" on that row | a task creation modal opens AND the Approver can specify task details (description, priority, due date) AND click "Create" to assign the task to the Requester AND the task appears in the Requester's task list linked to the specific cost code | |
| 5 | Approve/Reject Actions | an Approver has reviewed all cost codes | the Approver clicks "Approve" or "Reject" button | the action applies to the entire agreement AND if rejected with tasks created, the Requester is notified AND the agreement status updates accordingly | |
| 6 | Status Indication | cost codes have different statuses | displayed in the table | each row has appropriate color coding (Green for approved, Yellow for pending review, Red for rejected/flagged) AND the color scheme is accessible (meets WCAG contrast standards) | |

---

## 🎯 Key Points

### 1. ✅ KHÔNG hardcode
- Ticket key: Đọc từ `JIRA_BASE_URL`
- AC content: Generate từ ticket description
- Style: Học từ example ticket

### 2. ✅ Dựa vào nội dung thực tế
- Business requirements từ Jira ticket
- Pain points từ UAT feedback
- Solution proposal từ ticket description

### 3. ✅ Linh hoạt
- Đổi URL → Đổi ticket
- Ticket khác → AC khác
- Không cần sửa code

### 4. ✅ AI-powered
- Claude đọc và hiểu ticket
- Claude viết AC phù hợp
- Claude tuân thủ style của team

---

## 📊 Data Flow

```
.env (JIRA_BASE_URL)
  ↓
Extract "FCM-973"
  ↓
Fetch Jira API → Get ticket description
  ↓
Claude AI → Understand business requirements
  ↓
Claude AI → Generate user story + AC
  ↓
Parse AC from markdown
  ↓
Convert to Jira ADF table
  ↓
Update Jira API → Fill Acceptance Criteria field
```

---

## 💡 Example với ticket khác

```bash
# Ticket FCM-1234: "Add export feature"
JIRA_BASE_URL=https://oneline.atlassian.net/browse/FCM-1234

# Ticket description:
# "User needs to export data to Excel"

npm start

# Claude sẽ generate AC phù hợp:
AC1: Export Button Visible
- GIVEN user is on data page
- WHEN page loads
- THEN export button is displayed

AC2: Export to Excel
- GIVEN user clicks export
- WHEN process completes
- THEN Excel file is downloaded

AC3: Data Validation
- GIVEN exported file
- WHEN user opens
- THEN all data is correct
```

**→ AC khác nhau vì business requirement khác nhau!**

---

## 🎉 Summary

**Workflow thông minh:**
1. Đọc ticket URL từ .env
2. Fetch ticket content từ Jira
3. AI hiểu business requirements
4. AI viết AC dựa trên requirements
5. Parse AC từ markdown
6. Update vào Jira

**Không hardcode gì cả!** 🚀
