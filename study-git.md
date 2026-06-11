# 📚 Git Command Study Guide

## 🚀 Git Basics

### 1. Setup & Configuration

#### `git config` - Cấu hình Git
```bash
# Cấu hình tên user (global)
git config --global user.name "Nguyen Join"

# Cấu hình email
git config --global user.email "joinnguyen@gmail.com"

# Xem tất cả config
git config --list

# Xem config cụ thể
git config user.name

# Cấu hình cho repo hiện tại (local)
git config --local user.name "Work Name"

# Cấu hình editor mặc định
git config --global core.editor "code --wait"

# Cấu hình branch mặc định
git config --global init.defaultBranch main
```

**Example:**
```bash
# Setup lần đầu
git config --global user.name "Nguyen Join"
git config --global user.email "joinnguyen@gmail.com"
```

---

## 📂 Repository Management

### 2. `git init` - Khởi tạo Git repository

```bash
# Tạo repo mới trong folder hiện tại
git init

# Tạo repo mới trong folder cụ thể
git init my-project

# Tạo repo với branch name tùy chỉnh
git init --initial-branch=main
```

**Example:**
```bash
cd /Users/joinnguyen/Desktop/my-project
git init
# → Initialized empty Git repository in /Users/joinnguyen/Desktop/my-project/.git/
```

---

### 3. `git clone` - Clone repository

```bash
# Clone repo từ GitHub
git clone https://github.com/user/repo.git

# Clone và đổi tên folder
git clone https://github.com/user/repo.git my-folder

# Clone với SSH
git clone git@github.com:user/repo.git

# Clone một branch cụ thể
git clone -b develop https://github.com/user/repo.git

# Clone shallow (chỉ lấy commit gần nhất)
git clone --depth 1 https://github.com/user/repo.git
```

**Example:**
```bash
# Clone repo của mình
git clone git@github.com:nguyenthanhjoin08031998/test-claude-atlassian.git
cd test-claude-atlassian
```

---

## 📝 Staging & Committing

### 4. `git status` - Xem trạng thái

```bash
# Xem trạng thái đầy đủ
git status

# Xem trạng thái ngắn gọn
git status -s
git status --short

# Xem trạng thái của branch
git status -sb
```

**Example:**
```bash
git status
# On branch main
# Changes not staged for commit:
#   modified:   index.js
# Untracked files:
#   new-file.js
```

**Output giải thích:**
- `modified:` - File đã sửa nhưng chưa stage
- `Untracked files:` - File mới, Git chưa track
- `Changes to be committed:` - File đã stage, sẵn sàng commit

---

### 5. `git add` - Thêm file vào staging

```bash
# Add một file
git add index.js

# Add nhiều files
git add index.js style.css

# Add tất cả files
git add .
git add -A
git add --all

# Add tất cả files .js
git add *.js

# Add tất cả files trong folder
git add src/

# Add interactively (chọn từng phần)
git add -p
git add --patch
```

**Example:**
```bash
# Tạo file mới
echo "console.log('Hello')" > app.js

# Check status
git status
# Untracked files: app.js

# Add file
git add app.js

# Check lại
git status
# Changes to be committed:
#   new file:   app.js
```

---

### 6. `git commit` - Commit changes

```bash
# Commit với message ngắn
git commit -m "Add login feature"

# Commit với message dài (mở editor)
git commit

# Commit và add luôn (files đã tracked)
git commit -am "Update config"

# Amend commit trước (sửa commit cuối)
git commit --amend

# Amend và đổi message
git commit --amend -m "New message"

# Amend không đổi message
git commit --amend --no-edit

# Commit empty (cho test)
git commit --allow-empty -m "Trigger CI"
```

**Example:**
```bash
# Workflow thông thường
git add .
git commit -m "feat: Add user authentication

- Add login page
- Add JWT token validation
- Add password hashing with bcrypt"

# Sửa lỗi commit trước (quên add file)
git add forgot-file.js
git commit --amend --no-edit
```

**Commit message conventions:**
- `feat:` - Tính năng mới
- `fix:` - Sửa bug
- `docs:` - Cập nhật docs
- `style:` - Format code (không đổi logic)
- `refactor:` - Refactor code
- `test:` - Thêm tests
- `chore:` - Maintenance tasks

---

## 🌳 Branching

### 7. `git branch` - Quản lý branches

```bash
# Xem tất cả branches
git branch

# Xem tất cả branches (bao gồm remote)
git branch -a

# Xem branches với commit cuối
git branch -v

# Tạo branch mới
git branch feature/login

# Đổi tên branch hiện tại
git branch -m new-name

# Đổi tên branch khác
git branch -m old-name new-name

# Xóa branch (safe - chỉ xóa nếu đã merged)
git branch -d feature/login

# Xóa branch (force - xóa dù chưa merged)
git branch -D feature/login

# Xem branches đã merged vào main
git branch --merged main

# Xem branches chưa merged
git branch --no-merged
```

**Example:**
```bash
# Tạo branch cho feature mới
git branch feature/user-profile

# Xem các branches
git branch
#   feature/user-profile
# * main

# Đổi tên branch
git branch -m feature/user-profile feature/profile-page

# Xóa branch sau khi merge
git branch -d feature/profile-page
```

---

### 8. `git checkout` - Chuyển branch/commit

```bash
# Chuyển sang branch khác
git checkout develop

# Tạo và chuyển sang branch mới
git checkout -b feature/new-feature

# Chuyển về commit cụ thể (detached HEAD)
git checkout abc1234

# Chuyển về commit và tạo branch
git checkout -b hotfix abc1234

# Discard changes của file (nguy hiểm!)
git checkout -- index.js

# Restore file từ branch khác
git checkout main -- config.js
```

**Example:**
```bash
# Tạo branch mới và chuyển sang
git checkout -b feature/payment
# Switched to a new branch 'feature/payment'

# Làm việc...
git add .
git commit -m "Add payment integration"

# Chuyển về main
git checkout main
# Switched to branch 'main'
```

---

### 9. `git switch` - Chuyển branch (mới hơn)

```bash
# Chuyển branch
git switch develop

# Tạo và chuyển branch mới
git switch -c feature/new-feature

# Quay về branch trước đó
git switch -

# Tạo branch từ remote
git switch -c local-branch origin/remote-branch
```

**Example:**
```bash
# Tạo feature branch
git switch -c feature/search
# Switched to a new branch 'feature/search'

# Chuyển về main
git switch main

# Quay lại feature/search
git switch -
```

---

### 10. `git merge` - Merge branches

```bash
# Merge branch vào branch hiện tại
git merge feature/login

# Merge với commit message tùy chỉnh
git merge feature/login -m "Merge login feature"

# Merge không tạo merge commit (fast-forward)
git merge --ff-only feature/login

# Merge luôn tạo merge commit
git merge --no-ff feature/login

# Abort merge khi có conflict
git merge --abort

# Continue merge sau khi resolve conflict
git merge --continue
```

**Example:**
```bash
# Đang ở main, muốn merge feature
git switch main
git merge feature/payment

# Nếu có conflict:
# CONFLICT (content): Merge conflict in index.js
# Automatic merge failed; fix conflicts and then commit

# Sửa conflicts trong editor...

git add index.js
git commit -m "Merge feature/payment into main"

# Hoặc abort nếu không muốn merge
git merge --abort
```

---

## 🔄 Remote Repositories

### 11. `git remote` - Quản lý remote repos

```bash
# Xem remote repos
git remote

# Xem chi tiết (với URLs)
git remote -v

# Thêm remote mới
git remote add origin https://github.com/user/repo.git

# Đổi URL của remote
git remote set-url origin git@github.com:user/repo.git

# Đổi tên remote
git remote rename origin upstream

# Xóa remote
git remote remove origin

# Xem thông tin remote
git remote show origin
```

**Example:**
```bash
# Thêm remote repository
git remote add origin git@github.com:nguyenthanhjoin08031998/test-claude-atlassian.git

# Kiểm tra
git remote -v
# origin  git@github.com:nguyenthanhjoin08031998/test-claude-atlassian.git (fetch)
# origin  git@github.com:nguyenthanhjoin08031998/test-claude-atlassian.git (push)

# Đổi sang HTTPS
git remote set-url origin https://github.com/nguyenthanhjoin08031998/test-claude-atlassian.git
```

---

### 12. `git push` - Push lên remote

```bash
# Push branch hiện tại lên remote
git push

# Push và set upstream (lần đầu)
git push -u origin main
git push --set-upstream origin main

# Push branch cụ thể
git push origin feature/login

# Push tất cả branches
git push --all

# Push tags
git push --tags

# Force push (nguy hiểm!)
git push --force
git push -f

# Force push an toàn hơn
git push --force-with-lease

# Xóa remote branch
git push origin --delete feature/old-feature
git push origin :feature/old-feature
```

**Example:**
```bash
# Push lần đầu
git push -u origin main
# Branch 'main' set up to track remote branch 'main' from 'origin'

# Push bình thường (sau lần đầu)
git push

# Push feature branch
git switch -c feature/new-ui
git commit -am "Update UI"
git push -u origin feature/new-ui

# Xóa remote branch sau khi merge
git push origin --delete feature/new-ui
```

---

### 13. `git pull` - Pull từ remote

```bash
# Pull từ remote (fetch + merge)
git pull

# Pull từ remote và branch cụ thể
git pull origin main

# Pull với rebase thay vì merge
git pull --rebase

# Pull tất cả branches
git pull --all

# Pull và prune (xóa refs cũ)
git pull --prune
```

**Example:**
```bash
# Đồng đội push code mới
# Bạn pull về
git pull
# remote: Counting objects: 5, done.
# Updating abc1234..def5678
# Fast-forward
#  index.js | 10 ++++++++
#  1 file changed, 10 insertions(+)

# Pull với rebase (git history sạch hơn)
git pull --rebase
```

---

### 14. `git fetch` - Fetch từ remote (không merge)

```bash
# Fetch tất cả từ remote
git fetch

# Fetch từ remote cụ thể
git fetch origin

# Fetch branch cụ thể
git fetch origin main

# Fetch tất cả remotes
git fetch --all

# Fetch và prune (xóa refs đã không tồn tại)
git fetch --prune

# Fetch tags
git fetch --tags
```

**Example:**
```bash
# Fetch để xem có gì mới không (không merge)
git fetch origin

# Xem diff giữa local và remote
git diff main origin/main

# Nếu OK thì merge
git merge origin/main

# Hoặc dùng pull luôn (fetch + merge)
git pull
```

---

## 📜 History & Logs

### 15. `git log` - Xem commit history

```bash
# Xem log đầy đủ
git log

# Xem log ngắn gọn (1 line/commit)
git log --oneline

# Xem 5 commits gần nhất
git log -5

# Xem log với graph
git log --graph --oneline --all

# Xem log của file cụ thể
git log -- index.js

# Xem log với author
git log --author="Join"

# Xem log theo date
git log --since="2 weeks ago"
git log --after="2024-01-01"
git log --before="2024-12-31"

# Xem log với pattern
git log --grep="fix"

# Xem log với stat (files changed)
git log --stat

# Xem log với diff
git log -p
```

**Example:**
```bash
# Xem log đẹp
git log --graph --oneline --all --decorate
# * acf61d8 (HEAD -> main, origin/main) feat: User Story Generator
# * 5b2c1a4 docs: Update README
# * 8f3d9e2 fix: Handle empty AC
# * 1a2b3c4 feat: Add Jira integration

# Xem ai sửa file này
git log --oneline -- package.json
# acf61d8 feat: User Story Generator
# 1a2b3c4 feat: Add Jira integration

# Xem commits của mình trong 1 tuần
git log --author="Join" --since="1 week ago" --oneline
```

---

### 16. `git show` - Xem chi tiết commit

```bash
# Xem commit cuối
git show

# Xem commit cụ thể
git show abc1234

# Xem file trong commit
git show abc1234:index.js

# Xem stat của commit
git show --stat abc1234

# Xem chỉ diff
git show --no-patch abc1234
```

**Example:**
```bash
# Xem commit cuối làm gì
git show
# commit acf61d8
# Author: Nguyen Join <joinnguyen@gmail.com>
# Date:   Thu Jun 5 22:14:00 2024
#
#     feat: User Story Generator for Jira
#
# diff --git a/package.json b/package.json
# ...

# Xem file cụ thể trong commit cũ
git show abc1234:old-config.js
```

---

### 17. `git diff` - So sánh changes

```bash
# Xem changes chưa staged
git diff

# Xem changes đã staged
git diff --staged
git diff --cached

# So sánh 2 branches
git diff main..develop

# So sánh 2 commits
git diff abc1234..def5678

# So sánh với remote
git diff main origin/main

# Diff của file cụ thể
git diff index.js

# Diff với stat (tóm tắt)
git diff --stat

# Diff với color
git diff --color-words
```

**Example:**
```bash
# Sửa file
echo "new line" >> index.js

# Xem đã sửa gì
git diff
# diff --git a/index.js b/index.js
# index abc1234..def5678 100644
# --- a/index.js
# +++ b/index.js
# @@ -1,3 +1,4 @@
#  console.log('Hello');
# +new line

# So sánh với branch khác
git diff main..feature/login
```

---

## ⏪ Undoing Changes

### 18. `git reset` - Reset commits/staging

```bash
# Unstage file (giữ changes)
git reset index.js

# Unstage tất cả (giữ changes)
git reset

# Reset về commit trước (giữ changes)
git reset HEAD~1
git reset HEAD^

# Reset về commit trước (mất changes trong staging)
git reset --mixed HEAD~1

# Reset về commit trước (giữ changes trong staging)
git reset --soft HEAD~1

# Reset về commit trước (XÓA TẤT CẢ CHANGES - NGUY HIỂM!)
git reset --hard HEAD~1

# Reset về commit cụ thể
git reset --hard abc1234

# Reset về remote
git reset --hard origin/main
```

**Example:**
```bash
# Commit nhầm, muốn sửa lại
git add .
git commit -m "Wrong commit"

# Undo commit, giữ changes
git reset --soft HEAD~1

# Sửa lại
git add .
git commit -m "Correct commit"

# HOẶC: Xóa luôn commit và changes (NGUY HIỂM!)
git reset --hard HEAD~1
```

**⚠️ Cảnh báo:**
- `--soft`: An toàn nhất, giữ changes trong staging
- `--mixed`: Mặc định, giữ changes nhưng unstage
- `--hard`: NGUY HIỂM, xóa tất cả changes

---

### 19. `git revert` - Revert commit (an toàn)

```bash
# Revert commit cuối
git revert HEAD

# Revert commit cụ thể
git revert abc1234

# Revert nhiều commits
git revert abc1234..def5678

# Revert nhưng chưa commit
git revert --no-commit HEAD

# Continue revert
git revert --continue

# Abort revert
git revert --abort
```

**Example:**
```bash
# Commit có bug
git log --oneline
# abc1234 (HEAD) Add buggy feature
# def5678 Update config

# Revert commit có bug (tạo commit mới)
git revert abc1234
# [main xyz9876] Revert "Add buggy feature"

# Log sau revert
git log --oneline
# xyz9876 (HEAD) Revert "Add buggy feature"
# abc1234 Add buggy feature
# def5678 Update config
```

**Khác biệt `reset` vs `revert`:**
- `reset`: Xóa commits khỏi history (nguy hiểm với shared branches)
- `revert`: Tạo commit mới để undo (an toàn, giữ history)

---

### 20. `git restore` - Restore files (Git 2.23+)

```bash
# Discard changes trong working directory
git restore index.js

# Discard tất cả changes
git restore .

# Unstage file (giống reset)
git restore --staged index.js

# Restore file từ commit cụ thể
git restore --source=abc1234 index.js

# Restore file từ branch khác
git restore --source=main config.js
```

**Example:**
```bash
# Sửa file nhưng không muốn giữ
echo "bad code" >> index.js

git status
# modified: index.js

# Discard changes
git restore index.js

git status
# nothing to commit, working tree clean

# Unstage file
git add index.js
git restore --staged index.js
```

---

## 🏷️ Tags

### 21. `git tag` - Quản lý tags

```bash
# Xem tất cả tags
git tag

# Tạo lightweight tag
git tag v1.0.0

# Tạo annotated tag (có message)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag commit cũ
git tag -a v0.9.0 abc1234 -m "Version 0.9.0"

# Xem tag info
git show v1.0.0

# Xóa tag local
git tag -d v1.0.0

# Xóa tag remote
git push origin --delete v1.0.0

# Push tag lên remote
git push origin v1.0.0

# Push tất cả tags
git push --tags

# Checkout tag (detached HEAD)
git checkout v1.0.0
```

**Example:**
```bash
# Release version mới
git tag -a v1.0.0 -m "Release 1.0.0

- Add user authentication
- Add payment integration
- Fix security issues"

# Push tag lên GitHub
git push origin v1.0.0

# Push tất cả tags
git push --tags

# Xem tags
git tag
# v0.9.0
# v1.0.0

# Checkout version cũ để test
git checkout v0.9.0
# Note: detached HEAD state
```

---

## 🔍 Searching & Debugging

### 22. `git grep` - Search trong repo

```bash
# Search text trong working tree
git grep "function"

# Search trong branch khác
git grep "config" main

# Search với line numbers
git grep -n "TODO"

# Search case-insensitive
git grep -i "error"

# Search với context
git grep -A 2 -B 2 "import"

# Count matches
git grep -c "console.log"
```

**Example:**
```bash
# Tìm tất cả TODO
git grep -n "TODO"
# index.js:10:// TODO: Add validation
# app.js:25:// TODO: Refactor this

# Tìm console.log để cleanup
git grep "console.log" | wc -l
# 15
```

---

### 23. `git blame` - Xem ai sửa dòng nào

```bash
# Xem ai sửa file
git blame index.js

# Xem từ dòng 10 đến 20
git blame -L 10,20 index.js

# Xem với author email
git blame -e index.js

# Ignore whitespace changes
git blame -w index.js
```

**Example:**
```bash
git blame package.json
# acf61d8 (Nguyen Join 2024-06-05 10) {
# acf61d8 (Nguyen Join 2024-06-05 11)   "name": "user-story-agent",
# 1a2b3c4 (John Doe    2024-05-20 15)   "version": "1.0.0",
# ...
```

---

### 24. `git bisect` - Tìm commit gây bug

```bash
# Start bisect
git bisect start

# Mark current as bad
git bisect bad

# Mark commit tốt (không có bug)
git bisect good abc1234

# Git sẽ checkout commit giữa, test và mark
git bisect bad   # Nếu vẫn có bug
git bisect good  # Nếu không có bug

# Git tự động tìm commit gây bug

# Kết thúc
git bisect reset
```

**Example:**
```bash
# Bug xuất hiện, tìm commit gây ra
git bisect start
git bisect bad                    # Current có bug
git bisect good v1.0.0           # v1.0.0 OK

# Git checkout commit giữa
# Bisecting: 5 revisions left to test

# Test code... có bug
git bisect bad

# Git checkout commit khác
# Test... OK
git bisect good

# ...lặp lại...

# Git tìm ra commit
# abc1234 is the first bad commit

git bisect reset
```

---

## 🧹 Maintenance

### 25. `git clean` - Xóa untracked files

```bash
# Xem files sẽ bị xóa (dry run)
git clean -n

# Xóa untracked files
git clean -f

# Xóa cả directories
git clean -fd

# Xóa cả ignored files
git clean -fx

# Xóa tất cả (nguy hiểm!)
git clean -fdx

# Interactive mode
git clean -i
```

**Example:**
```bash
# Có nhiều files test không cần
ls
# index.js  test1.tmp  test2.tmp  debug.log

# Xem sẽ xóa gì
git clean -n
# Would remove test1.tmp
# Would remove test2.tmp
# Would remove debug.log

# Xóa
git clean -f
# Removing test1.tmp
# Removing test2.tmp
# Removing debug.log
```

---

### 26. `git stash` - Lưu changes tạm thời

```bash
# Stash changes hiện tại
git stash

# Stash với message
git stash save "WIP: working on feature"
git stash push -m "WIP: working on feature"

# Stash bao gồm untracked files
git stash -u

# Xem stash list
git stash list

# Apply stash gần nhất (giữ stash)
git stash apply

# Apply stash cụ thể
git stash apply stash@{0}

# Pop stash (apply và xóa)
git stash pop

# Xem stash diff
git stash show

# Xóa stash
git stash drop stash@{0}

# Xóa tất cả stashes
git stash clear

# Tạo branch từ stash
git stash branch feature/new-work
```

**Example:**
```bash
# Đang code feature, cần fix bug gấp
git stash save "WIP: payment integration"
# Saved working directory

# Switch sang hotfix
git switch -c hotfix/urgent-bug
# Fix bug...
git commit -am "Fix urgent bug"

# Quay lại feature
git switch feature/payment
git stash pop
# Changes unstashed

# Hoặc stash nhiều lần
git stash list
# stash@{0}: WIP: payment integration
# stash@{1}: WIP: user profile
# stash@{2}: WIP: dashboard

# Apply stash cụ thể
git stash apply stash@{1}
```

---

## 🔧 Advanced

### 27. `git rebase` - Rebase branch

```bash
# Rebase branch hiện tại lên main
git rebase main

# Rebase interactive (edit commits)
git rebase -i HEAD~3

# Rebase và continue
git rebase --continue

# Skip commit khi rebase
git rebase --skip

# Abort rebase
git rebase --abort

# Rebase onto
git rebase --onto main feature1 feature2
```

**Example:**
```bash
# Feature branch cần update từ main
git switch feature/login

# Log trước rebase
git log --oneline --graph
# * 456def (HEAD -> feature/login) Add login UI
# * 789abc Add login API
# * 123xyz (main) Update config

# Rebase lên main
git rebase main

# Nếu có conflict
# CONFLICT (content): Merge conflict in index.js
# Sửa conflict...
git add index.js
git rebase --continue

# Log sau rebase
git log --oneline --graph
# * abc123 (HEAD -> feature/login) Add login UI
# * def456 Add login API
# * 789xyz (main) Update config
```

**Interactive rebase:**
```bash
# Edit 3 commits gần nhất
git rebase -i HEAD~3

# Editor mở:
# pick abc1234 Add feature A
# pick def5678 Fix typo
# pick ghi9012 Add feature B

# Có thể:
# pick - Giữ nguyên
# reword - Đổi commit message
# edit - Sửa commit
# squash - Gộp vào commit trước
# fixup - Gộp vào commit trước (bỏ message)
# drop - Xóa commit

# Example: Gộp fix typo vào feature A
# pick abc1234 Add feature A
# fixup def5678 Fix typo
# pick ghi9012 Add feature B
```

---

### 28. `git cherry-pick` - Copy commits

```bash
# Cherry-pick một commit
git cherry-pick abc1234

# Cherry-pick nhiều commits
git cherry-pick abc1234 def5678

# Cherry-pick range
git cherry-pick abc1234..def5678

# Cherry-pick nhưng chưa commit
git cherry-pick --no-commit abc1234

# Continue cherry-pick
git cherry-pick --continue

# Abort cherry-pick
git cherry-pick --abort
```

**Example:**
```bash
# Có commit tốt ở branch khác, muốn lấy
git switch main
git log feature/payment --oneline
# abc1234 Fix payment validation
# def5678 Add PayPal integration

# Cherry-pick commit fix
git cherry-pick abc1234
# [main xyz9876] Fix payment validation

# Log
git log --oneline
# xyz9876 (HEAD -> main) Fix payment validation
# ...
```

---

### 29. `git reflog` - Xem tất cả refs history

```bash
# Xem reflog
git reflog

# Xem reflog của branch
git reflog show main

# Xem reflog với date
git reflog --date=relative

# Recover commit đã mất
git checkout HEAD@{1}
git reset --hard HEAD@{1}
```

**Example:**
```bash
# Reset nhầm, muốn recover
git log --oneline
# abc1234 Latest commit

git reset --hard HEAD~5
# HEAD is now at xyz9876

git log --oneline
# xyz9876 Old commit
# (mất 5 commits!)

# Dùng reflog tìm lại
git reflog
# xyz9876 HEAD@{0}: reset: moving to HEAD~5
# abc1234 HEAD@{1}: commit: Latest commit  ← đây!
# def5678 HEAD@{2}: commit: ...

# Recover
git reset --hard HEAD@{1}
# HEAD is now at abc1234

git log --oneline
# abc1234 Latest commit ← đã về lại!
```

---

## 📊 Statistics & Info

### 30. `git shortlog` - Tổng hợp commits theo author

```bash
# Tổng hợp commits
git shortlog

# Chỉ số lượng
git shortlog -sn

# Theo email
git shortlog -se

# Theo date range
git shortlog --since="1 month ago"
```

**Example:**
```bash
git shortlog -sn
#     45  Nguyen Join
#     23  John Doe
#     12  Jane Smith
```

---

## 🎯 Git Aliases (Shortcuts)

```bash
# Tạo aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --oneline --all --decorate"

# Sử dụng
git st        # = git status
git co main   # = git checkout main
git lg        # = git log --graph...
```

---

## 🆘 Common Workflows

### Workflow 1: Feature Branch

```bash
# 1. Tạo feature branch
git switch -c feature/new-feature

# 2. Code và commit
git add .
git commit -m "feat: Add new feature"

# 3. Push lên remote
git push -u origin feature/new-feature

# 4. Tạo Pull Request trên GitHub

# 5. Sau khi merge, cleanup
git switch main
git pull
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### Workflow 2: Hotfix

```bash
# 1. Tạo hotfix từ main
git switch main
git pull
git switch -c hotfix/urgent-bug

# 2. Fix bug
git commit -am "fix: Urgent bug"

# 3. Push và merge nhanh
git push -u origin hotfix/urgent-bug
# Merge PR ngay

# 4. Pull về main
git switch main
git pull
```

### Workflow 3: Update Feature từ Main

```bash
# 1. Đang ở feature branch
git switch feature/my-feature

# 2. Fetch main mới nhất
git fetch origin main

# 3. Rebase hoặc merge
git rebase origin/main
# Hoặc: git merge origin/main

# 4. Resolve conflicts nếu có
git add .
git rebase --continue

# 5. Force push (nếu dùng rebase)
git push --force-with-lease
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Detached HEAD"

```bash
# Đang ở detached HEAD
git switch -c temp-branch    # Tạo branch để giữ work
git switch main              # Về main
git merge temp-branch        # Merge nếu cần
```

### Issue 2: Conflict khi merge

```bash
# Có conflict
git merge feature/payment
# CONFLICT in index.js

# Sửa trong editor, tìm:
# <<<<<<< HEAD
# your code
# =======
# their code
# >>>>>>> feature/payment

# Sau khi sửa
git add index.js
git commit
```

### Issue 3: Push bị reject

```bash
# Error: Updates were rejected

# Pull trước
git pull --rebase origin main

# Rồi push lại
git push
```

### Issue 4: Undo commit đã push

```bash
# Đừng dùng reset nếu đã push!
# Dùng revert
git revert HEAD
git push
```

---

## 📝 Best Practices

1. **Commit messages rõ ràng**
   ```bash
   git commit -m "feat: Add user login

   - Implement JWT authentication
   - Add password hashing
   - Create login form"
   ```

2. **Commit nhỏ, thường xuyên**
   ```bash
   # Tốt
   git commit -m "feat: Add login form"
   git commit -m "feat: Add JWT validation"

   # Không tốt
   git commit -m "Add everything"
   ```

3. **Pull trước khi push**
   ```bash
   git pull
   git push
   ```

4. **Dùng branches cho features**
   ```bash
   git switch -c feature/new-feature
   ```

5. **Không commit secrets**
   ```bash
   # Thêm vào .gitignore
   .env
   secrets.json
   ```

---

## 🔗 Useful Resources

- Git Documentation: https://git-scm.com/doc
- Pro Git Book: https://git-scm.com/book
- GitHub Guides: https://guides.github.com
- Interactive Git Cheatsheet: https://ndpsoftware.com/git-cheatsheet.html

---

**Happy Git-ing! 🚀**
