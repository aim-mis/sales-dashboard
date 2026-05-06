# Git Workflow & GitHub Configuration

## Initial Setup (Complete These Steps)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name**: sales-dashboard
   - **Description**: Interactive sales data dashboard for analyzing client data
   - **Public/Private**: Choose visibility
   - **Do NOT initialize with files** (we have them)
3. Click "Create repository"

### Step 2: Connect Local Repository to GitHub
Copy the HTTPS URL from GitHub (looks like: `https://github.com/YOUR_USERNAME/sales-dashboard.git`)

Run these commands in your project directory:
```bash
cd "C:\Users\NVG\OneDrive - Arvin International\CLAUDE AI PROJECT\SalesDashboard"
git remote add origin https://github.com/YOUR_USERNAME/sales-dashboard.git
git branch -M main
git push -u origin main
```

### Step 3: Configure Git Credentials (One-time)
```bash
# For HTTPS authentication
git config --global credential.helper store
# Then enter your GitHub username and personal access token when prompted

# Or use GitHub CLI (if installed)
gh auth login
```

## Commit Workflow

### Make Changes
Edit files in the project (frontend/backend code, styles, configs)

### Stage Changes
```bash
# Stage specific files
git add <filename>

# Or stage all changes
git add .
```

### Review Changes Before Committing
```bash
git status      # See what's staged
git diff        # See actual changes
```

### Commit with Proper Message
```bash
git commit -m "Type: Brief description

Detailed explanation of changes (optional but recommended for larger changes)"
```

**Valid Commit Types:**
- `Feature`: New functionality (e.g., "Feature: Add client search filter")
- `Fix`: Bug fixes (e.g., "Fix: Correct calculation in cumulative cards")
- `Update`: Enhancements to existing features (e.g., "Update: Improve filter performance")
- `Refactor`: Code improvements (e.g., "Refactor: Extract filter logic to helper function")
- `Docs`: Documentation updates (e.g., "Docs: Update API documentation")
- `Style`: CSS/UI changes (e.g., "Style: Improve ONLY card colors")
- `Deploy`: Deployment configuration (e.g., "Deploy: Update production build")

### Push to GitHub
```bash
git push
```

## Automating Commits & Pushes

### Option 1: Manual with Clear Messages (Recommended)
Follow the workflow above for full control and clear history.

### Option 2: PowerShell Script for Auto-commit
Create `auto-commit.ps1` in project root:
```powershell
# Check for changes every 5 minutes and auto-commit
while ($true) {
    Set-Location "C:\Users\NVG\OneDrive - Arvin International\CLAUDE AI PROJECT\SalesDashboard"
    
    # Check for changes
    $status = git status --porcelain
    
    if ($status) {
        # Stage changes
        git add .
        
        # Auto-generate commit message based on changes
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Update: Automated commit at $timestamp"
        
        # Push to GitHub
        git push
        
        Write-Host "✓ Changes committed and pushed at $timestamp"
    }
    
    # Wait 5 minutes
    Start-Sleep -Seconds 300
}
```

Run it:
```powershell
.\auto-commit.ps1
```

### Option 3: Git Hooks (Advanced)
Set up post-commit hook to auto-push:
```bash
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
git push
EOF
```

## Best Practices

✅ **DO:**
- Write clear, descriptive commit messages
- Commit related changes together
- Push frequently (at least daily)
- Use proper commit types
- Explain the WHY in commit messages

❌ **DON'T:**
- Commit large unrelated changes together
- Use vague messages like "Update" or "Fix"
- Force push to main branch
- Commit node_modules or build files (.gitignore handles this)
- Leave uncommitted changes for days

## Viewing History

```bash
# View recent commits
git log --oneline -n 10

# View detailed commit info
git log --pretty=format:"%h %ad %s" --date=short

# View changes in a specific commit
git show <commit-hash>

# View all changes since last push
git log --oneline origin/main..HEAD
```

## Troubleshooting

### Can't Push: "fatal: Authentication failed"
```bash
# Clear stored credentials and re-authenticate
git config --global --unset credential.helper
git config --global credential.helper store
# Enter GitHub username and personal access token
```

### Forgot to Add a File to Last Commit
```bash
# Add the file and amend the commit
git add <forgotten-file>
git commit --amend --no-edit
git push -f  # Force push (only if not pushed yet)
```

### Need to Undo Last Commit
```bash
# Undo commit but keep changes
git reset HEAD~1

# Undo commit and discard changes
git reset --hard HEAD~1
```

## CLI Shortcuts

Add to your PowerShell profile or create batch commands:

```powershell
# PowerShell function: commit-and-push
function Commit-And-Push {
    param(
        [string]$Message = "Update: Automated changes"
    )
    git add .
    git commit -m $Message
    git push
}

# Usage: Commit-And-Push "Feature: Add new filter"
```

## GitHub Integration

### View Repository Online
- https://github.com/YOUR_USERNAME/sales-dashboard

### Set Up GitHub Actions (Optional)
Create `.github/workflows/ci.yml` for automated testing and deployment

### Protect Main Branch (Recommended)
1. Go to GitHub repo Settings > Branches
2. Add rule for `main` branch
3. Require pull request reviews before merge
4. Require status checks to pass

## Documentation
- **CLAUDE.md**: Project configuration and patterns
- **README.md**: Project overview and setup instructions
- **DEPLOYMENT_INFO.md**: Production deployment details
- **GIT_WORKFLOW.md**: This file - git workflow guide

---

**Questions?** Refer to CLAUDE.md for project-specific details or GitHub documentation.
